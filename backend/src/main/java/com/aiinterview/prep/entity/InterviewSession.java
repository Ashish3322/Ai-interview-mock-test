package com.aiinterview.prep.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Role role;

    @Column(nullable = false, length = 32)
    private String difficulty = "Medium";

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 5;

    @Column(name = "current_question_index", nullable = false)
    private Integer currentQuestionIndex = 0;

    @Column(name = "overall_score")
    private Double overallScore = 0.0;

    @Column(name = "correctness_avg")
    private Double correctnessAvg = 0.0;

    @Column(name = "relevance_avg")
    private Double relevanceAvg = 0.0;

    @Column(name = "completeness_avg")
    private Double completenessAvg = 0.0;

    @Column(name = "clarity_avg")
    private Double clarityAvg = 0.0;

    @Column(name = "overall_recommendation", columnDefinition = "TEXT")
    private String overallRecommendation;

    @Column(nullable = false, length = 32)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id ASC")
    private List<InterviewResponse> responses = new ArrayList<>();

    public InterviewSession() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public Integer getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(Integer currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public Double getCorrectnessAvg() {
        return correctnessAvg;
    }

    public void setCorrectnessAvg(Double correctnessAvg) {
        this.correctnessAvg = correctnessAvg;
    }

    public Double getRelevanceAvg() {
        return relevanceAvg;
    }

    public void setRelevanceAvg(Double relevanceAvg) {
        this.relevanceAvg = relevanceAvg;
    }

    public Double getCompletenessAvg() {
        return completenessAvg;
    }

    public void setCompletenessAvg(Double completenessAvg) {
        this.completenessAvg = completenessAvg;
    }

    public Double getClarityAvg() {
        return clarityAvg;
    }

    public void setClarityAvg(Double clarityAvg) {
        this.clarityAvg = clarityAvg;
    }

    public String getOverallRecommendation() {
        return overallRecommendation;
    }

    public void setOverallRecommendation(String overallRecommendation) {
        this.overallRecommendation = overallRecommendation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<InterviewResponse> getResponses() {
        return responses;
    }

    public void setResponses(List<InterviewResponse> responses) {
        if (this.responses == null) {
            this.responses = new ArrayList<>();
        } else {
            this.responses.clear();
        }
        if (responses != null) {
            this.responses.addAll(responses);
        }
    }
}
