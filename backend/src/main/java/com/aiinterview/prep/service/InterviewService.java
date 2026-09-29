package com.aiinterview.prep.service;

import com.aiinterview.prep.ai.AiEvaluationService;
import com.aiinterview.prep.dto.*;
import com.aiinterview.prep.entity.*;
import com.aiinterview.prep.exception.BadRequestException;
import com.aiinterview.prep.exception.ResourceNotFoundException;
import com.aiinterview.prep.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewResponseRepository responseRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final QuestionRepository questionRepository;
    private final AiEvaluationService aiEvaluationService;
    private final ObjectMapper objectMapper;

    @Autowired
    public InterviewService(InterviewSessionRepository sessionRepository,
                            InterviewResponseRepository responseRepository,
                            FeedbackRepository feedbackRepository,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            QuestionRepository questionRepository,
                            AiEvaluationService aiEvaluationService) {
        this.sessionRepository = sessionRepository;
        this.responseRepository = responseRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.questionRepository = questionRepository;
        this.aiEvaluationService = aiEvaluationService;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public InterviewSessionDto startInterview(Long userId, StartInterviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

        List<Question> availableQuestions;
        if (request.getDifficulty() != null && !request.getDifficulty().equalsIgnoreCase("All")) {
            availableQuestions = questionRepository.findByRoleIdAndDifficultyAndActiveTrue(role.getId(), request.getDifficulty());
            if (availableQuestions.isEmpty()) {
                availableQuestions = questionRepository.findByRoleIdAndActiveTrue(role.getId());
            }
        } else {
            availableQuestions = questionRepository.findByRoleIdAndActiveTrue(role.getId());
        }

        if (availableQuestions.isEmpty()) {
            throw new BadRequestException("No active questions available for this role. Please add questions first.");
        }

        Collections.shuffle(availableQuestions);
        int totalToTake = Math.min(request.getTotalQuestions(), availableQuestions.size());
        List<Question> selectedQuestions = availableQuestions.subList(0, totalToTake);

        InterviewSession session = new InterviewSession();
        session.setUser(user);
        session.setRole(role);
        session.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : role.getDifficulty());
        session.setTotalQuestions(totalToTake);
        session.setCurrentQuestionIndex(0);
        session.setStatus("IN_PROGRESS");
        session.setStartedAt(LocalDateTime.now());

        InterviewSession savedSession = sessionRepository.save(session);

        for (Question q : selectedQuestions) {
            InterviewResponse resp = new InterviewResponse();
            resp.setSession(savedSession);
            resp.setQuestion(q);
            resp.setCandidateAnswer("");
            resp.setTimeTakenSeconds(0);
            resp.setScore(0);
            resp.setCorrectness(0);
            resp.setRelevance(0);
            resp.setCompleteness(0);
            resp.setClarity(0);
            responseRepository.save(resp);
        }

        return getInterviewSession(savedSession.getId(), userId);
    }

    @Transactional(readOnly = true)
    public InterviewSessionDto getInterviewSession(Long sessionId, Long userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        if (!session.getUser().getId().equals(userId) && !session.getUser().getRole().contains("ADMIN")) {
            throw new BadRequestException("Unauthorized access to interview session");
        }

        List<InterviewResponse> responses = responseRepository.findBySessionIdOrderByIdAsc(sessionId);
        InterviewSessionDto dto = new InterviewSessionDto(session, responses);

        if ("IN_PROGRESS".equals(session.getStatus()) && session.getCurrentQuestionIndex() < responses.size()) {
            InterviewResponse currentResp = responses.get(session.getCurrentQuestionIndex());
            dto.setCurrentQuestion(new QuestionDto(currentResp.getQuestion()));
        }

        return dto;
    }

    @Transactional
    public InterviewSessionDto submitAnswer(Long sessionId, Long userId, SubmitAnswerRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found with id: " + sessionId));

        if (!session.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this session");
        }

        if (!"IN_PROGRESS".equals(session.getStatus())) {
            throw new BadRequestException("Interview session is already completed");
        }

        List<InterviewResponse> responses = responseRepository.findBySessionIdOrderByIdAsc(sessionId);
        int currentIndex = session.getCurrentQuestionIndex();

        if (currentIndex >= responses.size()) {
            throw new BadRequestException("All questions have already been answered");
        }

        InterviewResponse responseToUpdate = responses.get(currentIndex);
        if (!responseToUpdate.getQuestion().getId().equals(request.getQuestionId())) {
            throw new BadRequestException("Question ID does not match current question in sequence");
        }

        Question question = responseToUpdate.getQuestion();

        // Perform AI evaluation
        EvaluationResult evaluation = aiEvaluationService.evaluateAnswer(
                question.getQuestionText(),
                question.getCategory(),
                question.getExpectedTopics(),
                question.getModelAnswer(),
                request.getAnswer()
        );

        responseToUpdate.setCandidateAnswer(request.getAnswer().trim());
        responseToUpdate.setTimeTakenSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0);
        responseToUpdate.setScore(evaluation.getScore());
        responseToUpdate.setCorrectness(evaluation.getCorrectness());
        responseToUpdate.setRelevance(evaluation.getRelevance());
        responseToUpdate.setCompleteness(evaluation.getCompleteness());
        responseToUpdate.setClarity(evaluation.getClarity());
        responseToUpdate.setSubmittedAt(LocalDateTime.now());

        String strengthsJson = toJson(evaluation.getStrengths());
        String weaknessesJson = toJson(evaluation.getWeaknesses());

        Feedback feedback = new Feedback();
        feedback.setResponse(responseToUpdate);
        feedback.setStrengths(strengthsJson);
        feedback.setWeaknesses(weaknessesJson);
        feedback.setFeedbackText(evaluation.getFeedback());

        responseToUpdate.setFeedback(feedback);
        responseRepository.save(responseToUpdate);

        // Advance to next question
        int nextIndex = currentIndex + 1;
        session.setCurrentQuestionIndex(nextIndex);

        // Check if finished
        if (nextIndex >= session.getTotalQuestions() || nextIndex >= responses.size()) {
            completeSession(session, responses);
        }

        sessionRepository.save(session);
        return getInterviewSession(session.getId(), userId);
    }

    @Transactional
    public InterviewSessionDto finishInterview(Long sessionId, Long userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access");
        }

        if ("IN_PROGRESS".equals(session.getStatus())) {
            List<InterviewResponse> responses = responseRepository.findBySessionIdOrderByIdAsc(sessionId);
            completeSession(session, responses);
            sessionRepository.save(session);
        }

        return getInterviewSession(sessionId, userId);
    }

    private void completeSession(InterviewSession session, List<InterviewResponse> responses) {
        session.setStatus("COMPLETED");
        session.setCompletedAt(LocalDateTime.now());

        List<InterviewResponse> answered = responses.stream()
                .filter(r -> r.getCandidateAnswer() != null && !r.getCandidateAnswer().isBlank())
                .collect(Collectors.toList());

        if (answered.isEmpty()) {
            session.setOverallScore(0.0);
            session.setCorrectnessAvg(0.0);
            session.setRelevanceAvg(0.0);
            session.setCompletenessAvg(0.0);
            session.setClarityAvg(0.0);
            session.setOverallRecommendation("No answers were submitted during this interview session.");
            return;
        }

        double avgScore = answered.stream().mapToInt(InterviewResponse::getScore).average().orElse(0.0) * 10.0;
        double avgCorrectness = answered.stream().mapToInt(InterviewResponse::getCorrectness).average().orElse(0.0);
        double avgRelevance = answered.stream().mapToInt(InterviewResponse::getRelevance).average().orElse(0.0);
        double avgCompleteness = answered.stream().mapToInt(InterviewResponse::getCompleteness).average().orElse(0.0);
        double avgClarity = answered.stream().mapToInt(InterviewResponse::getClarity).average().orElse(0.0);

        session.setOverallScore(Math.round(avgScore * 10.0) / 10.0);
        session.setCorrectnessAvg(Math.round(avgCorrectness * 10.0) / 10.0);
        session.setRelevanceAvg(Math.round(avgRelevance * 10.0) / 10.0);
        session.setCompletenessAvg(Math.round(avgCompleteness * 10.0) / 10.0);
        session.setClarityAvg(Math.round(avgClarity * 10.0) / 10.0);

        StringBuilder rec = new StringBuilder();
        if (avgScore >= 85) {
            rec.append("Outstanding performance! You are interview-ready for ").append(session.getRole().getName())
                    .append(". Focus on maintaining consistency and tackling senior-level system design nuances.");
        } else if (avgScore >= 70) {
            rec.append("Strong technical foundation. You communicated core ideas well, but aim to incorporate more practical trade-offs and code examples to secure top percentile marks.");
        } else if (avgScore >= 50) {
            rec.append("Good start, but additional focused preparation is advised. Revise foundational data structures, framework mechanisms, and practice articulate verbal explanations.");
        } else {
            rec.append("Significant gaps detected in core subject matter. Prioritize fundamental concepts and practice answering behavioral and technical questions in bullet points before retrying.");
        }
        session.setOverallRecommendation(rec.toString());
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionDto> getInterviewHistory(Long userId) {
        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByStartedAtDesc(userId);
        return sessions.stream().map(session -> {
            List<InterviewResponse> responses = responseRepository.findBySessionIdOrderByIdAsc(session.getId());
            return new InterviewSessionDto(session, responses);
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteSession(Long sessionId, Long userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this session");
        }

        sessionRepository.delete(session);
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }
}
