package com.veganmealprep.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meal {
    private String id;
    private String name;
    private String mealType;
    private LocalDateTime dateTime;
    private List<String> foods;
    private String notes;
    private boolean isVegan;
    private Nutrition totalNutrition;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Nutrition {
        private double calories;
        private double protein;
        private double carbs;
        private double fat;
        private double fiber;
        private double sugar;
    }
} 