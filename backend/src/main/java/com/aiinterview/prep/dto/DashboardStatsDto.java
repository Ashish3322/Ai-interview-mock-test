package com.aiinterview.prep.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalInterviews = 0;
    private double averageScore = 0.0;
    private double bestScore = 0.0;
    private long completedSessions = 0;
    private List<InterviewSessionDto> recentInterviews = new ArrayList<>();
    private Map<String, Double> skillsBreakdown = new HashMap<>();
    private List<String> strengths = new ArrayList<>();
    private List<String> areasToImprove = new ArrayList<>();

    public DashboardStatsDto() {}

    public long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(long totalInterviews) { this.totalInterviews = totalInterviews; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public double getBestScore() { return bestScore; }
    public void setBestScore(double bestScore) { this.bestScore = bestScore; }
    public long getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(long completedSessions) { this.completedSessions = completedSessions; }
    public List<InterviewSessionDto> getRecentInterviews() { return recentInterviews; }
    public void setRecentInterviews(List<InterviewSessionDto> recentInterviews) { this.recentInterviews = recentInterviews; }
    public Map<String, Double> getSkillsBreakdown() { return skillsBreakdown; }
    public void setSkillsBreakdown(Map<String, Double> skillsBreakdown) { this.skillsBreakdown = skillsBreakdown; }
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public List<String> getAreasToImprove() { return areasToImprove; }
    public void setAreasToImprove(List<String> areasToImprove) { this.areasToImprove = areasToImprove; }
}
