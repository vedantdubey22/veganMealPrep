package com.veganmealprep.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String picture;
    private String googleId;
    private String accessToken;
    private String refreshToken;
} 