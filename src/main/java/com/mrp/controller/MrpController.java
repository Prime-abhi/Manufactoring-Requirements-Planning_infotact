 
package com.mrp.controller;

import com.mrp.dto.MrpResultResponse;
import com.mrp.service.MrpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/mrp")
@CrossOrigin(origins = "*")
public class MrpController {

    private final MrpService mrpService;

    public MrpController(MrpService mrpService) {
        this.mrpService = mrpService;
    }

    /**
     * GET /api/mrp/explode/{itemId}?quantity=<number>
     */
    @GetMapping("/explode/{itemId}")
    public ResponseEntity<?> explode(
            @PathVariable String itemId,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "quantity must be a positive number"));
        }
        try {
            MrpResultResponse result = mrpService.explode(itemId, quantity);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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
