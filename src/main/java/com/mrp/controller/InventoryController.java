 
package com.mrp.controller;

import com.mrp.dto.CreateInventoryRequest;
import com.mrp.dto.UpdateInventoryRequest;
import com.mrp.entity.InventoryItem;
import com.mrp.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/inventory-status")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * GET /api/inventory-status
     */
    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    /**
     * GET /api/inventory-status/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return inventoryService.getInventoryById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(404)
                .body(Map.of("error", "Inventory item not found")));
    }

    /**
     * POST /api/inventory-status
     * Body: { productId, name, sku, available, minStock, unitPrice? }
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateInventoryRequest request) {
        try {
            InventoryItem created = inventoryService.addStockLevel(request);
            return ResponseEntity.status(201)
                .body(Map.of(
                    "message", "Stock level added successfully",
                    "item", created
                ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/inventory-status/{id}
     * Body: { "availableQuantity": <number> }
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQty(
            @PathVariable String id,
            @Valid @RequestBody UpdateInventoryRequest request) {
        return inventoryService.updateAvailableQty(id, request.getAvailableQuantity())
            .<ResponseEntity<?>>map(item -> ResponseEntity.ok(Map.of(
                "message", "Inventory updated successfully",
                "item", item
            )))
            .orElse(ResponseEntity.status(404)
                .body(Map.of("error", "Inventory item not found")));
    }

    // ── Exception Handlers ────────────────────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .toList();
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Validation failed", "details", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return ResponseEntity.status(500)
            .body(Map.of("error", "Internal server error", "message", ex.getMessage()));
    }
}
