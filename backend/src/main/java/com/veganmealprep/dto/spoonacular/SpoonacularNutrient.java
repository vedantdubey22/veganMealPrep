package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpoonacularNutrient {
    private String name;
    private double amount;
    private String unit;
} 