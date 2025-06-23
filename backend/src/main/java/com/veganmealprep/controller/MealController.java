package com.veganmealprep.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import javax.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@RestController
@RequestMapping("/api/meals")
public class MealController {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private String getUserIdFromToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = header.substring(7);
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Save a meal for the authenticated user
    @PostMapping("")
    public ResponseEntity<?> saveMeal(HttpServletRequest request, @RequestBody Map<String, Object> meal) {
        try {
            String userId = getUserIdFromToken(request);
            Firestore db = FirestoreClient.getFirestore();
            CollectionReference mealsRef = db.collection("users").document(userId).collection("meals");
            ApiFuture<DocumentReference> future = mealsRef.add(meal);
            String mealId = future.get().getId();
            return ResponseEntity.ok(Map.of("mealId", mealId));
        } catch (Exception e) {
            log.error("Error saving meal: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all meals for the authenticated user
    @GetMapping("")
    public ResponseEntity<?> getMeals(HttpServletRequest request) {
        try {
            String userId = getUserIdFromToken(request);
            Firestore db = FirestoreClient.getFirestore();
            CollectionReference mealsRef = db.collection("users").document(userId).collection("meals");
            ApiFuture<QuerySnapshot> future = mealsRef.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            List<Map<String, Object>> meals = documents.stream().map(QueryDocumentSnapshot::getData).toList();
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            log.error("Error fetching meals: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a meal for the authenticated user
    @DeleteMapping("/{mealId}")
    public ResponseEntity<?> deleteMeal(HttpServletRequest request, @PathVariable String mealId) {
        try {
            String userId = getUserIdFromToken(request);
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference mealRef = db.collection("users").document(userId).collection("meals").document(mealId);
            ApiFuture<WriteResult> writeResult = mealRef.delete();
            writeResult.get();
            return ResponseEntity.ok(Map.of("deleted", true));
        } catch (Exception e) {
            log.error("Error deleting meal {}: {}", mealId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
} 