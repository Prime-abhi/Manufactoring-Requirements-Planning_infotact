package com.mrp.controller;

import com.mrp.entity.Product;
import com.mrp.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /** GET /api/products  or  GET /api/products?type=FINISHED_GOOD */
    @GetMapping
    public ResponseEntity<?> getProducts(@RequestParam(required = false) String type) {
        try {
            List<Product> products = productService.getProducts(type);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid type value: " + type));
        }
    }

    /** GET /api/products/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(404)
                .body(Map.of("error", "Product not found")));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .toList();
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Validation failed", "details", errors));
    }
}
