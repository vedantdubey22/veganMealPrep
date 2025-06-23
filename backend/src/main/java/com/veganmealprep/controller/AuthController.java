package com.veganmealprep.controller;

import com.veganmealprep.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {
    private final AuthService authService;
    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            logger.info("Received Google login request with email: {}", payload.get("email"));
            
            String token = authService.authenticateGoogle(
                payload.get("email"),
                payload.get("name"),
                payload.get("picture"),
                payload.get("googleId")
            );
            
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            logger.error("Error during Google authentication", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");
            if (email == null || password == null || email.isBlank() || password.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }
            // Check if user already exists
            Firestore db = FirestoreClient.getFirestore();
            CollectionReference usersRef = db.collection("users");
            Query query = usersRef.whereEqualTo("email", email);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            if (!querySnapshot.get().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }
            // Save new user (plain text password for demo; hash in production!)
            Map<String, Object> user = new HashMap<>();
            user.put("email", email);
            user.put("password", password);
            usersRef.add(user);
            return ResponseEntity.ok(Map.of("message", "Account created!"));
        } catch (Exception e) {
            logger.error("Error during signup", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");
            if (email == null || password == null || email.isBlank() || password.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }
            Firestore db = FirestoreClient.getFirestore();
            CollectionReference usersRef = db.collection("users");
            Query query = usersRef.whereEqualTo("email", email).whereEqualTo("password", password);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            if (querySnapshot.get().isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Not Found"));
            }
            // Return a dummy token for now
            return ResponseEntity.ok(Map.of("token", "dummy-token", "message", "Login successful!"));
        } catch (Exception e) {
            logger.error("Error during login", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
} 