package com.veganmealprep.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "user_requirements")
public class UserRequirements {
    @Id
    private String id;
    private String gender;
    private int age;
    private double heightCm;
    private double weightKg;
    private String activityLevel;
    private Requirements requirements;

    @Data
    public static class Requirements {
        private double bmi;
        private double dailyCalories;
        private MacroBreakdown macros;
    }

    @Data
    public static class MacroBreakdown {
        private double carbsGrams;
        private double proteinGrams;
        private double fatGrams;
    }
} 