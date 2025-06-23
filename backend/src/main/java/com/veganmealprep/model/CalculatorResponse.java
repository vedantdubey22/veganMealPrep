package com.veganmealprep.model;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CalculatorResponse {
    private double bmi;
    private double dailyCalories;
    private MacroBreakdown macros;

    @Data
    @Builder
    public static class MacroBreakdown {
        private double carbsGrams;
        private double proteinGrams;
        private double fatGrams;
    }
} 