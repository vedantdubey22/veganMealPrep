package com.veganmealprep.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "nutrition")
public class Nutrition {
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;
    private double sugar;
    private double sodium;
    private double potassium;
    private double vitaminC;
    private double iron;
    private double calcium;
} 