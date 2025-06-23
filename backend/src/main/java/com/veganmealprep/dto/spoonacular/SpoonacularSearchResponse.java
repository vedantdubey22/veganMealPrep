package com.veganmealprep.dto.spoonacular;

import java.util.List;
import lombok.Data;

@Data
public class SpoonacularSearchResponse {
    private int offset;
    private int number;
    private List<SpoonacularSearchResult> results;
    private int totalResults;
} 