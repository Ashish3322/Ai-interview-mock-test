package com.aiinterview.prep.dto;

import java.util.ArrayList;
import java.util.List;

public class EvaluationResult {
    private Integer score = 8;
    private Integer correctness = 8;
    private Integer relevance = 9;
    private Integer completeness = 7;
    private Integer clarity = 8;
    private List<String> strengths = new ArrayList<>();
    private List<String> weaknesses = new ArrayList<>();
    private String feedback = "";

    public EvaluationResult() {}

    public EvaluationResult(Integer score, Integer correctness, Integer relevance, Integer completeness, Integer clarity,
                            List<String> strengths, List<String> weaknesses, String feedback) {
        this.score = score;
        this.correctness = correctness;
        this.relevance = relevance;
        this.completeness = completeness;
        this.clarity = clarity;
        this.strengths = strengths != null ? strengths : new ArrayList<>();
        this.weaknesses = weaknesses != null ? weaknesses : new ArrayList<>();
        this.feedback = feedback;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getCorrectness() {
        return correctness;
    }

    public void setCorrectness(Integer correctness) {
        this.correctness = correctness;
    }

    public Integer getRelevance() {
        return relevance;
    }

    public void setRelevance(Integer relevance) {
        this.relevance = relevance;
    }

    public Integer getCompleteness() {
        return completeness;
    }

    public void setCompleteness(Integer completeness) {
        this.completeness = completeness;
    }

    public Integer getClarity() {
        return clarity;
    }

    public void setClarity(Integer clarity) {
        this.clarity = clarity;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
