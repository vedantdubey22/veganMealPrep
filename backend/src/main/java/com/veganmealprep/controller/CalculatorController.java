package com.veganmealprep.controller;

import com.veganmealprep.model.CalculatorRequest;
import com.veganmealprep.model.CalculatorResponse;
import com.veganmealprep.service.CalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculator")
@RequiredArgsConstructor
public class CalculatorController {

    private final CalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<CalculatorResponse> calculate(@RequestBody CalculatorRequest request) {
        CalculatorResponse response = calculatorService.calculate(request);
        return ResponseEntity.ok(response);
    }
} 