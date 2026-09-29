package com.aiinterview.prep.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_id", nullable = false, unique = true)
    @JsonIgnore
    private InterviewResponse response;

    @Column(columnDefinition = "TEXT")
    private String strengths; // JSON array or comma separated string

    @Column(columnDefinition = "TEXT")
    private String weaknesses; // JSON array or comma separated string

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {
    }

    public Feedback(InterviewResponse response, String strengths, String weaknesses, String feedbackText) {
        this.response = response;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.feedbackText = feedbackText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InterviewResponse getResponse() {
        return response;
    }

    public void setResponse(InterviewResponse response) {
        this.response = response;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
