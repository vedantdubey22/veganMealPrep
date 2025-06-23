package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import java.util.List;

@Data
public class SpoonacularNutritionResponse {
    private int id;
    private String name;
    private String image;
    private List<Nutrient> nutrition;
    private List<Nutrient> nutrients;
    private double amount;
    private boolean possible;
    private double amountPerServing;
} 