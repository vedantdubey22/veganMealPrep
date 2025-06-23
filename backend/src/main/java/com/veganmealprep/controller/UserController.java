package com.veganmealprep.controller;

import com.veganmealprep.model.UserRequirements;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping("/requirements")
    public ResponseEntity<UserRequirements> saveRequirements(@RequestBody UserRequirements requirements) {
        log.info("Saving user requirements: {}", requirements);
        // For now, just return the requirements as-is since we haven't set up MongoDB yet
        return ResponseEntity.ok(requirements);
    }
} 