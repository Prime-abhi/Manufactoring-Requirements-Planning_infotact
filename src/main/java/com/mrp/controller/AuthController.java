package com.mrp.controller;

import com.mrp.dto.LoginRequest;
import com.mrp.dto.LoginResponse;
import com.mrp.entity.User;
import com.mrp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return authService.authenticate(request.getUsername(), request.getPassword())
            .<ResponseEntity<?>>map(user -> {
                // Simple token — replace with JWT in production
                String token = UUID.randomUUID().toString();
                return ResponseEntity.ok(
                    new LoginResponse(token, user.getUsername(), user.getRole()));
            })
            .orElse(ResponseEntity.status(401)
                .body(Map.of("error", "Invalid username or password")));
    }
}
