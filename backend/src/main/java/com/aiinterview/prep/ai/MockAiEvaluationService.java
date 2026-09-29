package com.aiinterview.prep.ai;

import com.aiinterview.prep.dto.EvaluationResult;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("mockAiEvaluationService")
public class MockAiEvaluationService implements AiEvaluationService {

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String category, String expectedTopics, String modelAnswer, String candidateAnswer) {
        if (candidateAnswer == null || candidateAnswer.trim().isEmpty()) {
            return new EvaluationResult(
                    1, 1, 1, 1, 1,
                    List.of("Attempted to respond"),
                    List.of("No substantial answer provided", "Please elaborate on key concepts"),
                    "You did not provide an answer. Please review the question and provide a structured explanation covering fundamental concepts."
            );
        }

        String answer = candidateAnswer.trim().toLowerCase();
        String[] topics = expectedTopics != null ? expectedTopics.split(",") : new String[0];
        int matchedTopics = 0;
        List<String> matchedTopicNames = new ArrayList<>();
        List<String> missingTopicNames = new ArrayList<>();

        for (String topic : topics) {
            String cleanTopic = topic.trim().toLowerCase();
            if (!cleanTopic.isEmpty()) {
                if (answer.contains(cleanTopic)) {
                    matchedTopics++;
                    matchedTopicNames.add(topic.trim());
                } else {
                    missingTopicNames.add(topic.trim());
                }
            }
        }

        int wordCount = candidateAnswer.trim().split("\\s+").length;

        // Base metrics calculation
        int correctness = 6;
        int relevance = 7;
        int completeness = 6;
        int clarity = 7;

        // Word count bonus/penalty
        if (wordCount > 60) {
            completeness += 2;
            clarity += 1;
        } else if (wordCount > 30) {
            completeness += 1;
        } else if (wordCount < 15) {
            completeness = Math.max(3, completeness - 2);
            clarity = Math.max(4, clarity - 2);
        }

        // Expected topics evaluation
        if (topics.length > 0) {
            double coverage = (double) matchedTopics / topics.length;
            if (coverage >= 0.7) {
                correctness += 3;
                relevance += 2;
                completeness += 2;
            } else if (coverage >= 0.4) {
                correctness += 2;
                relevance += 1;
                completeness += 1;
            } else if (coverage > 0) {
                correctness += 1;
            } else {
                correctness = Math.max(4, correctness - 1);
            }
        }

        // Bound to 1 - 10
        correctness = Math.min(10, Math.max(1, correctness));
        relevance = Math.min(10, Math.max(1, relevance));
        completeness = Math.min(10, Math.max(1, completeness));
        clarity = Math.min(10, Math.max(1, clarity));

        int overallScore = (int) Math.round((correctness * 0.35) + (relevance * 0.25) + (completeness * 0.25) + (clarity * 0.15));
        overallScore = Math.min(10, Math.max(1, overallScore));

        // Strengths & Weaknesses
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();

        if (wordCount >= 30) {
            strengths.add("Clear and articulated explanations");
        }
        if (!matchedTopicNames.isEmpty()) {
            strengths.add("Good coverage of core topics: " + String.join(", ", matchedTopicNames.subList(0, Math.min(2, matchedTopicNames.size()))));
        } else {
            strengths.add("Identified the core concept required by the prompt");
        }
        if (clarity >= 8) {
            strengths.add("Structured reasoning with good readability");
        }

        if (wordCount < 35) {
            weaknesses.add("Elaborate further with real-world examples or implementation details");
        }
        if (!missingTopicNames.isEmpty()) {
            weaknesses.add("Discuss additional key points: " + String.join(", ", missingTopicNames.subList(0, Math.min(2, missingTopicNames.size()))));
        } else {
            weaknesses.add("Consider touching upon edge cases or performance tradeoffs");
        }

        StringBuilder feedbackBuilder = new StringBuilder();
        if (overallScore >= 8) {
            feedbackBuilder.append("Excellent response! You demonstrated strong technical depth and articulated the fundamental concepts clearly. ");
        } else if (overallScore >= 6) {
            feedbackBuilder.append("Solid answer. You covered the foundational principles accurately, though adding practical code examples or architectural context would elevate your rating. ");
        } else {
            feedbackBuilder.append("Fair attempt. Your explanation addresses the question at a surface level, but lacks in-depth technical terminology and complete conceptual coverage. ");
        }

        if (!missingTopicNames.isEmpty()) {
            feedbackBuilder.append("In a formal interview, interviewers also look for mentions of ")
                    .append(String.join(", ", missingTopicNames.subList(0, Math.min(2, missingTopicNames.size()))))
                    .append(".");
        }

        return new EvaluationResult(
                overallScore,
                correctness,
                relevance,
                completeness,
                clarity,
                strengths,
                weaknesses,
                feedbackBuilder.toString()
        );
    }
}
