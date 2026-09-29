package com.aiinterview.prep.ai;

import com.aiinterview.prep.dto.EvaluationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AiEvaluationServiceManager implements AiEvaluationService {

    private final MockAiEvaluationService mockAiEvaluationService;
    private final GeminiAiEvaluationService geminiAiEvaluationService;

    @Value("${ai.provider:mock}")
    private String provider;

    @Value("${ai.api-key:}")
    private String apiKey;

    @Autowired
    public AiEvaluationServiceManager(MockAiEvaluationService mockAiEvaluationService,
                                     GeminiAiEvaluationService geminiAiEvaluationService) {
        this.mockAiEvaluationService = mockAiEvaluationService;
        this.geminiAiEvaluationService = geminiAiEvaluationService;
    }

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String category, String expectedTopics, String modelAnswer, String candidateAnswer) {
        if ("gemini".equalsIgnoreCase(provider) || (apiKey != null && !apiKey.isBlank() && !apiKey.equals("your_api_key_here"))) {
            return geminiAiEvaluationService.evaluateAnswer(questionText, category, expectedTopics, modelAnswer, candidateAnswer);
        }
        return mockAiEvaluationService.evaluateAnswer(questionText, category, expectedTopics, modelAnswer, candidateAnswer);
    }
}
