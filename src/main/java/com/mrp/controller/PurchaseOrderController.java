package com.mrp.controller;

import com.mrp.entity.PurchaseOrder;
import com.mrp.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            try {
                PurchaseOrder.Status s = PurchaseOrder.Status.valueOf(status.toUpperCase());
                return ResponseEntity.ok(purchaseOrderService.getByStatus(s));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(purchaseOrderService.getById(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPO(@RequestBody Map<String, Object> body) {
        try {
            Long itemId = Long.parseLong(body.get("itemId").toString());
            Double quantity = Double.parseDouble(body.get("quantity").toString());
            PurchaseOrder.Reason reason = PurchaseOrder.Reason.valueOf(
                body.getOrDefault("reason", "LOW_STOCK").toString().toUpperCase());
            return ResponseEntity.ok(purchaseOrderService.createPurchaseOrder(itemId, quantity, reason));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/auto/{itemId}")
    public ResponseEntity<?> autoCreateForLowStock(@PathVariable Long itemId) {
        try {
            return ResponseEntity.ok(purchaseOrderService.autoCreateForLowStock(itemId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePO(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(purchaseOrderService.approvePO(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPO(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(purchaseOrderService.cancelPO(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}