package com.veganmealprep.service;

import com.veganmealprep.dto.spoonacular.SpoonacularSearchResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularNutritionResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularNutrition;
import com.veganmealprep.dto.spoonacular.SpoonacularIngredientResponse;
import com.veganmealprep.dto.spoonacular.Nutrient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpoonacularService {

    private final WebClient spoonacularWebClient;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    public Mono<SpoonacularSearchResponse> searchRecipes(String query) {
        log.info("Searching ingredients with query: {}", query);
        return spoonacularWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/food/ingredients/search")
                        .queryParam("apiKey", apiKey)
                        .queryParam("query", query)
                        .queryParam("number", 5)
                        .queryParam("sortDirection", "desc")
                        .queryParam("metaInformation", true)
                        .queryParam("diet", "vegan")
                        .queryParam("intolerances", "dairy,egg")
                        .build())
                .retrieve()
                .bodyToMono(SpoonacularSearchResponse.class)
                .doOnSuccess(response -> log.info("Found {} results for query: {}", 
                    response.getResults() != null ? response.getResults().size() : 0, query))
                .doOnError(error -> log.error("Error searching ingredients: {}", error.getMessage()));
    }

    public Mono<SpoonacularNutrition> getNutritionById(int id) {
        log.info("Getting nutrition info for id: {}", id);
        return spoonacularWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/food/ingredients/" + id + "/information")
                        .queryParam("apiKey", apiKey)
                        .queryParam("amount", 100)
                        .queryParam("unit", "grams")
                        .queryParam("addNutrition", true)
                        .build())
                .retrieve()
                .bodyToMono(SpoonacularIngredientResponse.class)
                .map(response -> {
                    log.info("Retrieved raw response for id {}: {}", id, response);
                    SpoonacularNutrition nutrition = new SpoonacularNutrition();
                    
                    if (response.getNutrition() != null && response.getNutrition().getNutrients() != null) {
                        for (Nutrient nutrient : response.getNutrition().getNutrients()) {
                            switch (nutrient.getName().toLowerCase()) {
                                case "calories":
                                    nutrition.setCalories(nutrient.getAmount());
                                    break;
                                case "protein":
                                    nutrition.setProtein(nutrient.getAmount());
                                    break;
                                case "carbohydrates":
                                    nutrition.setCarbs(nutrient.getAmount());
                                    break;
                                case "fat":
                                    nutrition.setFat(nutrient.getAmount());
                                    break;
                            }
                        }
                        log.info("Extracted nutrition data for id {}: {}", id, nutrition);
                    } else {
                        log.warn("No nutrition data found for id: {}", id);
                    }
                    
                    return nutrition;
                })
                .doOnError(error -> log.error("Error getting nutrition info: {}", error.getMessage()));
    }
}
