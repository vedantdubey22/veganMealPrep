package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpoonacularIngredientResponse {
    private int id;
    private String name;
    private String image;
    private double amount;
    private String unit;
    
    @JsonProperty("nutrition")
    private SpoonacularNutrition nutrition;
} 