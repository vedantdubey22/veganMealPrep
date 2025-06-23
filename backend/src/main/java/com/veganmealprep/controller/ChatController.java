package com.veganmealprep.controller;

import com.veganmealprep.model.ChatRequest;
import com.veganmealprep.model.ChatResponse;
import com.veganmealprep.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            logger.debug("Received chat request: {}", request);
            String response = chatService.getChatResponse(request.getMessage());
            return ResponseEntity.ok(new ChatResponse(response));
        } catch (Exception e) {
            logger.error("Error processing chat request", e);
            return ResponseEntity.ok(new ChatResponse("I encountered an error while processing your request. Please try again later."));
        }
    }
} 