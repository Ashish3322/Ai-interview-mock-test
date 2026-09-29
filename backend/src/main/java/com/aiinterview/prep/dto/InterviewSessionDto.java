package com.aiinterview.prep.dto;

import com.aiinterview.prep.entity.InterviewResponse;
import com.aiinterview.prep.entity.InterviewSession;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class InterviewSessionDto {
    private Long id;
    private Long roleId;
    private String roleName;
    private String roleIcon;
    private String difficulty;
    private Integer totalQuestions;
    private Integer currentQuestionIndex;
    private Double overallScore;
    private Double correctnessAvg;
    private Double relevanceAvg;
    private Double completenessAvg;
    private Double clarityAvg;
    private String overallRecommendation;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private QuestionDto currentQuestion;
    private List<ResponseDetailDto> responses = new ArrayList<>();

    public static class ResponseDetailDto {
        private Long responseId;
        private Long questionId;
        private String questionText;
        private String category;
        private String difficulty;
        private String modelAnswer;
        private String candidateAnswer;
        private Integer timeTakenSeconds;
        private Integer score;
        private Integer correctness;
        private Integer relevance;
        private Integer completeness;
        private Integer clarity;
        private String feedbackText;
        private List<String> strengths;
        private List<String> weaknesses;

        public ResponseDetailDto() {}

        public ResponseDetailDto(InterviewResponse r) {
            this.responseId = r.getId();
            if (r.getQuestion() != null) {
                this.questionId = r.getQuestion().getId();
                this.questionText = r.getQuestion().getQuestionText();
                this.category = r.getQuestion().getCategory();
                this.difficulty = r.getQuestion().getDifficulty();
                this.modelAnswer = r.getQuestion().getModelAnswer();
            }
            this.candidateAnswer = r.getCandidateAnswer();
            this.timeTakenSeconds = r.getTimeTakenSeconds();
            this.score = r.getScore();
            this.correctness = r.getCorrectness();
            this.relevance = r.getRelevance();
            this.completeness = r.getCompleteness();
            this.clarity = r.getClarity();
            if (r.getFeedback() != null) {
                this.feedbackText = r.getFeedback().getFeedbackText();
                this.strengths = parseList(r.getFeedback().getStrengths());
                this.weaknesses = parseList(r.getFeedback().getWeaknesses());
            }
        }

        private List<String> parseList(String raw) {
            List<String> list = new ArrayList<>();
            if (raw == null || raw.isBlank()) return list;
            String clean = raw.replaceAll("[\\[\\]\"]", "");
            for (String s : clean.split(",")) {
                if (!s.trim().isEmpty()) {
                    list.add(s.trim());
                }
            }
            return list;
        }

        public Long getResponseId() { return responseId; }
        public void setResponseId(Long responseId) { this.responseId = responseId; }
        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public String getModelAnswer() { return modelAnswer; }
        public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }
        public String getCandidateAnswer() { return candidateAnswer; }
        public void setCandidateAnswer(String candidateAnswer) { this.candidateAnswer = candidateAnswer; }
        public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
        public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public Integer getCorrectness() { return correctness; }
        public void setCorrectness(Integer correctness) { this.correctness = correctness; }
        public Integer getRelevance() { return relevance; }
        public void setRelevance(Integer relevance) { this.relevance = relevance; }
        public Integer getCompleteness() { return completeness; }
        public void setCompleteness(Integer completeness) { this.completeness = completeness; }
        public Integer getClarity() { return clarity; }
        public void setClarity(Integer clarity) { this.clarity = clarity; }
        public String getFeedbackText() { return feedbackText; }
        public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
        public List<String> getStrengths() { return strengths; }
        public void setStrengths(List<String> strengths) { this.strengths = strengths; }
        public List<String> getWeaknesses() { return weaknesses; }
        public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
    }

    public InterviewSessionDto() {}

    public InterviewSessionDto(InterviewSession session) {
        this.id = session.getId();
        if (session.getRole() != null) {
            this.roleId = session.getRole().getId();
            this.roleName = session.getRole().getName();
            this.roleIcon = session.getRole().getIcon();
        }
        this.difficulty = session.getDifficulty();
        this.totalQuestions = session.getTotalQuestions();
        this.currentQuestionIndex = session.getCurrentQuestionIndex();
        this.overallScore = session.getOverallScore();
        this.correctnessAvg = session.getCorrectnessAvg();
        this.relevanceAvg = session.getRelevanceAvg();
        this.completenessAvg = session.getCompletenessAvg();
        this.clarityAvg = session.getClarityAvg();
        this.overallRecommendation = session.getOverallRecommendation();
        this.status = session.getStatus();
        this.startedAt = session.getStartedAt();
        this.completedAt = session.getCompletedAt();
        if (session.getResponses() != null) {
            for (InterviewResponse r : session.getResponses()) {
                this.responses.add(new ResponseDetailDto(r));
            }
        }
    }

    public InterviewSessionDto(InterviewSession session, List<InterviewResponse> customResponses) {
        this(session);
        if (customResponses != null) {
            this.responses.clear();
            for (InterviewResponse r : customResponses) {
                this.responses.add(new ResponseDetailDto(r));
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    public String getRoleIcon() { return roleIcon; }
    public void setRoleIcon(String roleIcon) { this.roleIcon = roleIcon; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    public Integer getCurrentQuestionIndex() { return currentQuestionIndex; }
    public void setCurrentQuestionIndex(Integer currentQuestionIndex) { this.currentQuestionIndex = currentQuestionIndex; }
    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    public Double getCorrectnessAvg() { return correctnessAvg; }
    public void setCorrectnessAvg(Double correctnessAvg) { this.correctnessAvg = correctnessAvg; }
    public Double getRelevanceAvg() { return relevanceAvg; }
    public void setRelevanceAvg(Double relevanceAvg) { this.relevanceAvg = relevanceAvg; }
    public Double getCompletenessAvg() { return completenessAvg; }
    public void setCompletenessAvg(Double completenessAvg) { this.completenessAvg = completenessAvg; }
    public Double getClarityAvg() { return clarityAvg; }
    public void setClarityAvg(Double clarityAvg) { this.clarityAvg = clarityAvg; }
    public String getOverallRecommendation() { return overallRecommendation; }
    public void setOverallRecommendation(String overallRecommendation) { this.overallRecommendation = overallRecommendation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public QuestionDto getCurrentQuestion() { return currentQuestion; }
    public void setCurrentQuestion(QuestionDto currentQuestion) { this.currentQuestion = currentQuestion; }
    public List<ResponseDetailDto> getResponses() { return responses; }
    public void setResponses(List<ResponseDetailDto> responses) { this.responses = responses; }
}
