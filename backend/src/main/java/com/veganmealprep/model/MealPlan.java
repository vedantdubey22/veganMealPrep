package com.veganmealprep.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MealPlan {
    private String id;
    private String userId;
    private String name;
    private List<MealEntry> meals;
    private Nutrition totalNutrition;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class MealEntry {
        private String mealId;
        private String mealTime;
        private LocalDateTime date;
    }

    @Data
    public static class Nutrition {
        private Double calories;
        private Double protein;
        private Double carbs;
        private Double fat;
    }
} 