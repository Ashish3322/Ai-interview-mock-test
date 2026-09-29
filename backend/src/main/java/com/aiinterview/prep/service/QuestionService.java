package com.aiinterview.prep.service;

import com.aiinterview.prep.dto.QuestionDto;
import com.aiinterview.prep.entity.Question;
import com.aiinterview.prep.entity.Role;
import com.aiinterview.prep.exception.ResourceNotFoundException;
import com.aiinterview.prep.repository.QuestionRepository;
import com.aiinterview.prep.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, RoleRepository roleRepository) {
        this.questionRepository = questionRepository;
        this.roleRepository = roleRepository;
    }

    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(QuestionDto::new)
                .collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsByRole(Long roleId) {
        return questionRepository.findByRoleIdAndActiveTrue(roleId).stream()
                .map(QuestionDto::new)
                .collect(Collectors.toList());
    }

    public QuestionDto getQuestionById(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return new QuestionDto(q);
    }

    @Transactional
    public QuestionDto createQuestion(QuestionDto dto) {
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));

        Question question = new Question();
        question.setRole(role);
        question.setCategory(dto.getCategory());
        question.setQuestionText(dto.getQuestionText());
        question.setDifficulty(dto.getDifficulty() != null ? dto.getDifficulty() : "Medium");
        question.setExpectedTopics(dto.getExpectedTopics());
        question.setModelAnswer(dto.getModelAnswer());
        question.setActive(dto.getActive() != null ? dto.getActive() : true);

        Question saved = questionRepository.save(question);
        return new QuestionDto(saved);
    }

    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionDto dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
            question.setRole(role);
        }

        question.setCategory(dto.getCategory());
        question.setQuestionText(dto.getQuestionText());
        question.setDifficulty(dto.getDifficulty());
        question.setExpectedTopics(dto.getExpectedTopics());
        question.setModelAnswer(dto.getModelAnswer());
        if (dto.getActive() != null) {
            question.setActive(dto.getActive());
        }

        Question updated = questionRepository.save(question);
        return new QuestionDto(updated);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        questionRepository.delete(question);
    }

    @Transactional
    public QuestionDto toggleActive(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        question.setActive(!question.getActive());
        Question saved = questionRepository.save(question);
        return new QuestionDto(saved);
    }
}
