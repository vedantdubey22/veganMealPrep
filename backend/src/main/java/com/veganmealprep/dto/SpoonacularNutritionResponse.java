package com.veganmealprep.dto;

import java.util.List;

public class SpoonacularNutritionResponse {
    private Nutrition nutrition;

    public static class Nutrition {
        private List<Nutrient> nutrients;

        public List<Nutrient> getNutrients() {
            return nutrients;
        }

        public void setNutrients(List<Nutrient> nutrients) {
            this.nutrients = nutrients;
        }
    }

    public static class Nutrient {
        private String name;
        private double amount;
        private String unit;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }
    }

    public Nutrition getNutrition() {
        return nutrition;
    }

    public void setNutrition(Nutrition nutrition) {
        this.nutrition = nutrition;
    }
} 