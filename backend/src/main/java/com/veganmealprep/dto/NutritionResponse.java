package com.veganmealprep.dto;

import java.util.List;
import lombok.Data;
import com.veganmealprep.dto.spoonacular.Nutrient;

@Data
public class NutritionResponse {
    private String name;
    private List<Nutrient> nutrients;
    
    public double getNutrientAmount(String nutrientName) {
        if (nutrients == null) return 0;
        return nutrients.stream()
            .filter(n -> n.getName().equalsIgnoreCase(nutrientName))
            .findFirst()
            .map(Nutrient::getAmount)
            .orElse(0.0);
    }
    
    public double getProtein() {
        return getNutrientAmount("Protein");
    }
    
    public double getCarbs() {
        return getNutrientAmount("Carbohydrates");
    }
    
    public double getFat() {
        return getNutrientAmount("Fat");
    }
} 