package com.veganmealprep.service;

import com.veganmealprep.dto.spoonacular.SpoonacularSearchResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularNutritionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class FoodSearchService {

    private final WebClient spoonacularWebClient;
    
    @Value("${spoonacular.api.key}")
    private String apiKey;

    @Autowired
    public FoodSearchService(@Qualifier("spoonacularWebClient") WebClient spoonacularWebClient) {
        this.spoonacularWebClient = spoonacularWebClient;
    }

    public SpoonacularSearchResponse searchFood(String query) {
        return spoonacularWebClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/food/ingredients/search")
                        .queryParam("apiKey", apiKey)
                        .queryParam("query", query)
                        .queryParam("number", 10)
                        .queryParam("metaInformation", true)
                        .build())
                .retrieve()
                .bodyToMono(SpoonacularSearchResponse.class)
                .block();
    }

    public SpoonacularNutritionResponse getNutrition(int id) {
        return spoonacularWebClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/food/ingredients/" + id + "/information")
                        .queryParam("apiKey", apiKey)
                        .queryParam("amount", 100)
                        .queryParam("unit", "grams")
                        .build())
                .retrieve()
                .bodyToMono(SpoonacularNutritionResponse.class)
                .block();
    }
} 