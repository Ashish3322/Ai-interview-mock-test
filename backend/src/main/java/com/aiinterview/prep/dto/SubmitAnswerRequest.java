package com.aiinterview.prep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubmitAnswerRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Answer cannot be empty")
    private String answer;

    private Integer timeTakenSeconds = 0;

    public SubmitAnswerRequest() {}

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
}
