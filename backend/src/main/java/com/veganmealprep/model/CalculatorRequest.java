package com.veganmealprep.model;

import lombok.Data;

@Data
public class CalculatorRequest {
    private String gender;
    private int age;
    private double heightCm;
    private double weightKg;
    private String activityLevel;
} 