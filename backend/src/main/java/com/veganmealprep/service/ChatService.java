package com.veganmealprep.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final RestTemplate restTemplate;
    
    private static final String SYSTEM_PROMPT = "You are a concise vegan meal assistant. Follow these rules STRICTLY:\n\n" +
            "1. ONLY suggest 100% vegan ingredients and recipes\n" +
            "2. MAXIMUM 2 SENTENCES per response - be extremely brief\n" +
            "3. ONE recipe suggestion maximum per response\n" +
            "4. Use only whole food plant-based ingredients\n" +
            "5. Never mention or reference non-vegan items\n" +
            "6. If unsure if something is vegan, do not suggest it\n\n" +
            "Your responses must be:\n" +
            "- Ultra-concise (2 sentences max)\n" +
            "- 100% vegan guaranteed\n" +
            "- Practical and actionable\n" +
            "- Focused on whole foods\n\n" +
            "Remember: Be extremely brief and strictly vegan!";
    
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public ChatService() {
        this.restTemplate = new RestTemplate();
    }

    public String getChatResponse(String message) {
        try {
            logger.info("Sending request to Gemini API with message length: {}", message.length());

            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("key", apiKey)
                    .toUriString();

            // Combine system prompt with user message
            String fullPrompt = SYSTEM_PROMPT + "\n\nUser: " + message;

            Map<String, Object> part = new HashMap<>();
            part.put("text", fullPrompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            logger.debug("Making request to URL: {}", url);
            logger.debug("Request body: {}", requestBody);
            
            var response = restTemplate.postForObject(url, entity, Map.class);
            logger.debug("Received response: {}", response);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> candidateContent = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map<String, Object> firstPart = parts.get(0);
                        return (String) firstPart.get("text");
                    }
                }
            }

            logger.error("Invalid response format from Gemini API: {}", response);
            return "I apologize, but I received an unexpected response format. Please try again later.";

        } catch (HttpClientErrorException.Forbidden e) {
            logger.error("API key access denied: {}", e.getResponseBodyAsString());
            return "I apologize, but there seems to be an issue with the API configuration. Please ensure the Gemini API is enabled in your Google Cloud Console and try again.";
        } catch (HttpClientErrorException e) {
            logger.error("HTTP error from Gemini API: {} - {}", e.getRawStatusCode(), e.getResponseBodyAsString());
            return "I encountered an error while processing your request. Please try again later.";
        } catch (Exception e) {
            logger.error("Error calling Gemini API", e);
            return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
        }
    }
} 