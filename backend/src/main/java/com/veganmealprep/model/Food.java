package com.veganmealprep.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "foods")
public class Food {
    @Id
    private String id;
    private String name;
    private String image;
    private Nutrition nutrition;
    private boolean vegan;
    private String servingSize;
    private double servingWeight;
} 