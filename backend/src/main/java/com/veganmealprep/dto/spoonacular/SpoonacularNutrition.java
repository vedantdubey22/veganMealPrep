package com.veganmealprep.dto.spoonacular;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpoonacularNutrition {
    private List<Nutrient> nutrients;
    private double calories;
    private double fat;
    private double protein;
    private double carbs;
    
    @JsonProperty("caloricBreakdown")
    private CaloricBreakdown caloricBreakdown;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CaloricBreakdown {
        private double percentProtein;
        private double percentFat;
        private double percentCarbs;
    }
} 