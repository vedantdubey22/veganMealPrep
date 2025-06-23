// IMPORTANT: Do NOT use Node.js or Express in this project. Use Java/Spring Boot ONLY for all backend features.
package com.veganmealprep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class VeganMealPrepApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeganMealPrepApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
} 