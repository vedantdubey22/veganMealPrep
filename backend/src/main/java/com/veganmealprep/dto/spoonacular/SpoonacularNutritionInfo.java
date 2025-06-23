package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import java.util.List;

@Data
public class SpoonacularNutritionInfo {
    private List<SpoonacularNutrient> nutrients;
} 