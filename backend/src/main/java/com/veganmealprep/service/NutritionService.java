package com.veganmealprep.service;

import com.veganmealprep.dto.NutritionResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularSearchResponse;
import com.veganmealprep.dto.spoonacular.SpoonacularIngredientResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NutritionService {

    private final WebClient webClient;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    public NutritionService(@Qualifier("spoonacularWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<NutritionResponse> getNutritionInfo(String food) {
        log.info("Starting nutrition info search for: {}", food);
        return searchIngredient(food)
                .flatMap(this::getIngredientNutrition)
                .onErrorResume(WebClientResponseException.class, e -> {
                    log.error("API error: {} - {}", e.getRawStatusCode(), e.getResponseBodyAsString());
                    return Mono.just(new NutritionResponse());
                })
                .onErrorResume(Exception.class, e -> {
                    log.error("Unexpected error: {}", e.getMessage(), e);
                    return Mono.just(new NutritionResponse());
                })
                .doOnNext(response -> log.info("Final nutrition response: {}", response));
    }

    private Mono<SpoonacularSearchResponse> searchIngredient(String food) {
        String searchUrl = String.format("/food/ingredients/search?apiKey=%s&query=%s&number=1", apiKey, food);
        log.info("Making search request to: {}", searchUrl);
        
        return webClient.get()
                .uri(searchUrl)
                .retrieve()
                .bodyToMono(SpoonacularSearchResponse.class)
                .doOnNext(response -> {
                    log.info("Search response: {}", response);
                    if (response.getResults() != null && !response.getResults().isEmpty()) {
                        log.info("Found ingredient: id={}, name={}", 
                            response.getResults().get(0).getId(),
                            response.getResults().get(0).getName());
                    } else {
                        log.warn("No ingredients found for query: {}", food);
                    }
                })
                .doOnError(WebClientResponseException.class, e -> 
                    log.error("Search API error: {} - {}", e.getRawStatusCode(), e.getResponseBodyAsString())
                )
                .doOnError(Exception.class, e -> 
                    log.error("Unexpected search error: {}", e.getMessage(), e)
                );
    }

    private Mono<NutritionResponse> getIngredientNutrition(SpoonacularSearchResponse searchResponse) {
        if (searchResponse.getResults() == null || searchResponse.getResults().isEmpty()) {
            log.warn("No search results to get nutrition for");
            return Mono.just(new NutritionResponse());
        }

        var ingredient = searchResponse.getResults().get(0);
        String nutritionUrl = String.format("/food/ingredients/%d/information?apiKey=%s&amount=100&unit=grams&addNutrition=true", 
            ingredient.getId(), apiKey);
        log.info("Making nutrition request to: {}", nutritionUrl);

        return webClient.get()
                .uri(nutritionUrl)
                .retrieve()
                .bodyToMono(SpoonacularIngredientResponse.class)
                .doOnNext(result -> log.info("Nutrition response: {}", result))
                .map(result -> {
                    NutritionResponse response = new NutritionResponse();
                    response.setName(result.getName());
                    if (result.getNutrition() != null) {
                        response.setNutrients(result.getNutrition().getNutrients());
                        log.info("Got nutrition data for {}: {}", result.getName(), result.getNutrition());
                    } else {
                        log.warn("No nutrition data available for {}", result.getName());
                    }
                    return response;
                })
                .doOnError(WebClientResponseException.class, e -> 
                    log.error("Nutrition API error: {} - {}", e.getRawStatusCode(), e.getResponseBodyAsString())
                )
                .doOnError(Exception.class, e -> 
                    log.error("Unexpected nutrition error: {}", e.getMessage(), e)
                );
    }
} 