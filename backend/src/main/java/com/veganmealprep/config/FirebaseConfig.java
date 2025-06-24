package com.veganmealprep.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.File;

@Configuration
public class FirebaseConfig {
    @Value("${FIREBASE_SERVICE_ACCOUNT_PATH:}")
    private String serviceAccountPath;

    @PostConstruct
    public void init() throws IOException {
        System.out.println("[DEBUG] FIREBASE_SERVICE_ACCOUNT_PATH: " + serviceAccountPath);
        if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
            File f = new File(serviceAccountPath);
            System.out.println("[DEBUG] File exists at path: " + f.exists());
        }
        InputStream serviceAccount;
        if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
            serviceAccount = new java.io.FileInputStream(serviceAccountPath);
        } else {
            serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
        }
        if (serviceAccount == null) {
            throw new IOException("firebase-service-account.json not found in resources or at path: " + serviceAccountPath);
        }
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
} 