package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpoonacularSearchResult {
    private int id;
    private String name;
    private String image;
    
    @JsonProperty("nutrition")
    private SpoonacularNutrition nutrition;
} 