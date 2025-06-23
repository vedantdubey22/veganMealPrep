package com.veganmealprep.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "mealPlans")
public class MealPlan {
    @Id
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