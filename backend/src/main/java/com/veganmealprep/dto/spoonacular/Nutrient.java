package com.veganmealprep.dto.spoonacular;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nutrient {
    private String name;
    private double amount;
    private String unit;
    
    @JsonProperty("percentOfDailyNeeds")
    private Double percentOfDailyNeeds;
} 