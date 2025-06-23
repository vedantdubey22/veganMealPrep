package com.veganmealprep.model;

import lombok.Data;

@Data
public class Food {
    private String id;
    private String name;
    private String image;
    private Nutrition nutrition;
    private boolean vegan;
    private String servingSize;
    private double servingWeight;
} 