package com.veganmealprep.service;

import com.veganmealprep.model.CalculatorRequest;
import com.veganmealprep.model.CalculatorResponse;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public CalculatorResponse calculate(CalculatorRequest request) {
        // Calculate BMI
        double heightInMeters = request.getHeightCm() / 100.0;
        double bmi = request.getWeightKg() / (heightInMeters * heightInMeters);

        // Calculate BMR using Mifflin-St Jeor Formula
        double bmr;
        if ("male".equalsIgnoreCase(request.getGender())) {
            bmr = (10 * request.getWeightKg()) + (6.25 * request.getHeightCm()) - (5 * request.getAge()) + 5;
        } else {
            bmr = (10 * request.getWeightKg()) + (6.25 * request.getHeightCm()) - (5 * request.getAge()) - 161;
        }

        // Apply activity multiplier
        double activityMultiplier = getActivityMultiplier(request.getActivityLevel());
        double dailyCalories = bmr * activityMultiplier;

        // Calculate macro breakdown (40% carbs, 30% protein, 30% fat)
        double carbsCalories = dailyCalories * 0.4;
        double proteinCalories = dailyCalories * 0.3;
        double fatCalories = dailyCalories * 0.3;

        // Convert calories to grams (4 cal/g for carbs and protein, 9 cal/g for fat)
        CalculatorResponse.MacroBreakdown macros = CalculatorResponse.MacroBreakdown.builder()
                .carbsGrams(carbsCalories / 4.0)
                .proteinGrams(proteinCalories / 4.0)
                .fatGrams(fatCalories / 9.0)
                .build();

        return CalculatorResponse.builder()
                .bmi(bmi)
                .dailyCalories(dailyCalories)
                .macros(macros)
                .build();
    }

    private double getActivityMultiplier(String activityLevel) {
        return switch (activityLevel.toLowerCase()) {
            case "sedentary" -> 1.2;
            case "lightly active" -> 1.375;
            case "moderately active" -> 1.55;
            case "very active" -> 1.725;
            default -> 1.2;
        };
    }
} 