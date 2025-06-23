package com.veganmealprep.controller;

import com.veganmealprep.service.SpoonacularService;
import com.veganmealprep.dto.spoonacular.SpoonacularSearchResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularSearchResult;
import com.veganmealprep.dto.spoonacular.SpoonacularNutrition;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/food")
public class FoodSearchController {

    private final SpoonacularService spoonacularService;

    @Autowired
    public FoodSearchController(SpoonacularService spoonacularService) {
        this.spoonacularService = spoonacularService;
    }

    @GetMapping("/search")
    public Mono<List<SpoonacularSearchResult>> searchFood(@RequestParam String query) {
        log.info("Searching for food with query: {}", query);
        return spoonacularService.searchRecipes(query)
            .<List<SpoonacularSearchResult>>map(response -> {
                if (response != null && response.getResults() != null) {
                    log.info("Found {} results", response.getResults().size());
                    return response.getResults();
                }
                log.warn("No results found for query: {}", query);
                return Collections.emptyList();
            })
            .doOnError(error -> log.error("Error searching food: {}", error.getMessage()));
    }

    @GetMapping("/nutrition/{id}")
    public Mono<SpoonacularNutrition> getNutrition(@PathVariable int id) {
        log.info("Getting nutrition for food id: {}", id);
        return spoonacularService.getNutritionById(id)
            .doOnSuccess(response -> {
                log.info("Retrieved nutrition info for id {}: {}", id, response);
                if (response == null || response.getNutrients() == null) {
                    log.warn("No nutrition data available for id: {}", id);
                }
            })
            .doOnError(error -> log.error("Error getting nutrition: {}", error.getMessage()));
    }
} 