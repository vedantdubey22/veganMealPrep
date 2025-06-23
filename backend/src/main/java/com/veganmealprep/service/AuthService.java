package com.veganmealprep.service;

import com.veganmealprep.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class AuthService {
    private final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final Key key;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public AuthService(@Value("${jwt.secret}") String jwtSecret) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String authenticateGoogle(String email, String name, String picture, String googleId) {
        try {
            logger.info("Authenticating Google user with email: {}", email);
            if (email == null || googleId == null) {
                throw new IllegalArgumentException("Email and Google ID are required");
            }
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference docRef = db.collection("users").document(googleId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            User user;
            if (document.exists()) {
                user = document.toObject(User.class);
            } else {
                logger.info("Creating new user for Google ID: {}", googleId);
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPicture(picture);
                user.setGoogleId(googleId);
                docRef.set(user); // Save new user to Firestore
            }
            return generateToken(user);
        } catch (Exception e) {
            logger.error("Error during Google authentication", e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    private String generateToken(User user) {
        try {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpiration);

            return Jwts.builder()
                    .setSubject(user.getId())
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(key, SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating JWT token", e);
            throw new RuntimeException("Token generation failed: " + e.getMessage());
        }
    }
} 