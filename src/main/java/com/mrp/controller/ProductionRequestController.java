package com.mrp.controller;

import com.mrp.entity.ProductionRequest;
import com.mrp.service.ProductionRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/production-requests")
@CrossOrigin(origins = "*")
public class ProductionRequestController {

    private final ProductionRequestService service;

    public ProductionRequestController(ProductionRequestService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProductionRequest>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.getById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(404)
                .body(Map.of("error", "Production request not found")));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProductionRequest req) {
        try {
            return ResponseEntity.status(201).body(service.create(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            ProductionRequest.Status status =
                ProductionRequest.Status.valueOf(body.get("status").toUpperCase());
            return service.updateStatus(id, status)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                    .body(Map.of("error", "Production request not found")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
