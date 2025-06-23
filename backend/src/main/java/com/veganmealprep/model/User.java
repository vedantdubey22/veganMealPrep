package com.veganmealprep.model;

import lombok.Data;

@Data
public class User {
    private String id;
    private String email;
    private String name;
    private String picture;
    private String googleId;
    private String accessToken;
    private String refreshToken;
} 