package com.mrp.controller;

import com.mrp.dto.LoginRequest;
import com.mrp.dto.LoginResponse;
import com.mrp.entity.User;
import com.mrp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // API methods

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {
        try {
            User user = authService.login(
                request.getEmail(),
                request.getPassword());

            LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                "Login successful"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "error", e.getMessage()));
        }
    }

    // GET /api/auth/me/{id}
    @GetMapping("/me/{id}")
    public ResponseEntity<?> getMe(
            @PathVariable Long id) {
        try {
            User user = authService.getUserById(id);
            LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                "Success"
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "error", e.getMessage()));
        }
    }
}