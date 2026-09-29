package com.aiinterview.prep.ai;

import com.aiinterview.prep.dto.EvaluationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service("geminiAiEvaluationService")
public class GeminiAiEvaluationService implements AiEvaluationService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAiEvaluationService.class);

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.model:gemini-1.5-flash}")
    private String modelName;

    private final MockAiEvaluationService mockAiEvaluationService;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public GeminiAiEvaluationService(MockAiEvaluationService mockAiEvaluationService) {
        this.mockAiEvaluationService = mockAiEvaluationService;
        this.objectMapper = new ObjectMapper();
        this.restTemplate = new RestTemplate();
    }

    @Override
    public EvaluationResult evaluateAnswer(String questionText, String category, String expectedTopics, String modelAnswer, String candidateAnswer) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("your_api_key_here")) {
            logger.info("No AI_API_KEY provided; falling back to MockAiEvaluationService.");
            return mockAiEvaluationService.evaluateAnswer(questionText, category, expectedTopics, modelAnswer, candidateAnswer);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

            String prompt = """
                    You are an expert technical interviewer evaluating a job candidate's response.
                    
                    Interview Question: %s
                    Category: %s
                    Expected Topics / Keywords: %s
                    Reference Model Answer: %s
                    Candidate's Answer: %s
                    
                    Evaluate the candidate's answer objectively and return a valid JSON object ONLY (no markdown code blocks, no backticks).
                    JSON format:
                    {
                      "score": 8,
                      "correctness": 8,
                      "relevance": 9,
                      "completeness": 7,
                      "clarity": 8,
                      "strengths": ["Clear definition", "Accurate technical terminology"],
                      "weaknesses": ["Missed discussion on thread safety", "Lacks code illustration"],
                      "feedback": "Your answer demonstrates..."
                    }
                    All scores must be integers between 1 and 10.
                    """.formatted(questionText, category, expectedTopics, modelAnswer, candidateAnswer);

            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(contentObj));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    String rawText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                    rawText = rawText.replaceAll("```json", "").replaceAll("```", "").trim();
                    return objectMapper.readValue(rawText, EvaluationResult.class);
                }
            }
        } catch (Exception e) {
            logger.warn("Failed to evaluate using Gemini API ({}). Falling back to mock evaluator.", e.getMessage());
        }

        return mockAiEvaluationService.evaluateAnswer(questionText, category, expectedTopics, modelAnswer, candidateAnswer);
    }
}
