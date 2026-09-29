package com.aiinterview.prep.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StartInterviewRequest {
    @NotNull(message = "Role ID is required")
    private Long roleId;

    private String difficulty = "Medium";

    @Min(value = 1, message = "At least 1 question is required")
    @Max(value = 20, message = "Maximum 20 questions allowed")
    private Integer totalQuestions = 5;

    public StartInterviewRequest() {}

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}
