package com.aiinterview.prep.dto;

import com.aiinterview.prep.entity.Question;

public class QuestionDto {
    private Long id;
    private Long roleId;
    private String roleName;
    private String category;
    private String questionText;
    private String difficulty;
    private String expectedTopics;
    private String modelAnswer;
    private Boolean active;

    public QuestionDto() {}

    public QuestionDto(Question q) {
        this.id = q.getId();
        if (q.getRole() != null) {
            this.roleId = q.getRole().getId();
            this.roleName = q.getRole().getName();
        }
        this.category = q.getCategory();
        this.questionText = q.getQuestionText();
        this.difficulty = q.getDifficulty();
        this.expectedTopics = q.getExpectedTopics();
        this.modelAnswer = q.getModelAnswer();
        this.active = q.getActive();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getExpectedTopics() {
        return expectedTopics;
    }

    public void setExpectedTopics(String expectedTopics) {
        this.expectedTopics = expectedTopics;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
