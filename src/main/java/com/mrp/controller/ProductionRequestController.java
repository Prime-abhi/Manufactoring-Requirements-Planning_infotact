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

    private final ProductionRequestService productionRequestService;

    public ProductionRequestController(ProductionRequestService productionRequestService) {
        this.productionRequestService = productionRequestService;
    }

    // GET /api/production-requests
    @GetMapping
    public ResponseEntity<List<ProductionRequest>> getAllRequests() {
        return ResponseEntity.ok(productionRequestService.getAllRequests());
    }

    // GET /api/production-requests/my/{userId}
    @GetMapping("/my/{userId}")
    public ResponseEntity<List<ProductionRequest>> getMyRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(productionRequestService.getMyRequests(userId));
    }

    // POST /api/production-requests
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> request) {
        try {
            Long itemId = Long.parseLong(request.get("itemId").toString());
            Integer quantity = Integer.parseInt(request.get("quantity").toString());
            Long requestedById = Long.parseLong(request.get("requestedById").toString());
            String notes = request.get("notes") != null ? request.get("notes").toString() : "";

            return ResponseEntity.ok(
                productionRequestService.createRequest(itemId, quantity, requestedById, notes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/production-requests/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long managerId = Long.parseLong(request.get("managerId").toString());
            return ResponseEntity.ok(productionRequestService.approveRequest(id, managerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/production-requests/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long managerId = Long.parseLong(request.get("managerId").toString());
            String reason = request.get("reason") != null ? request.get("reason").toString() : "No reason provided";
            return ResponseEntity.ok(productionRequestService.rejectRequest(id, managerId, reason));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
