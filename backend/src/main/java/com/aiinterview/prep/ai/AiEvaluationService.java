package com.aiinterview.prep.ai;

import com.aiinterview.prep.dto.EvaluationResult;

public interface AiEvaluationService {
    EvaluationResult evaluateAnswer(String questionText, String category, String expectedTopics, String modelAnswer, String candidateAnswer);
}
