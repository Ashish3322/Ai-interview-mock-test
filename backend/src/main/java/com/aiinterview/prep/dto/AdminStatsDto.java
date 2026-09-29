package com.aiinterview.prep.dto;

public class AdminStatsDto {
    private long totalUsers;
    private long totalInterviews;
    private long totalQuestions;
    private double averageScore;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalUsers, long totalInterviews, long totalQuestions, double averageScore) {
        this.totalUsers = totalUsers;
        this.totalInterviews = totalInterviews;
        this.totalQuestions = totalQuestions;
        this.averageScore = averageScore;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(long totalInterviews) { this.totalInterviews = totalInterviews; }
    public long getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(long totalQuestions) { this.totalQuestions = totalQuestions; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
}
