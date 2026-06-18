package com.mrp.controller;

import com.mrp.entity.Item;
import com.mrp.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

	
	private final ItemService itemService;

	public ItemController(ItemService itemService) {
	    this.itemService = itemService;
	}

    // GET /api/items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems(
            @RequestParam(required = false) String type) {
        if (type != null) {
            try {
                Item.ItemType itemType = 
                    Item.ItemType.valueOf(type.toUpperCase());
                return ResponseEntity.ok(
                    itemService.getItemsByType(itemType));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }

    // GET /api/items/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(itemService.getItemById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/items/low-stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<Item>> getLowStockItems() {
        return ResponseEntity.ok(itemService.getLowStockItems());
    }

    // POST /api/items
    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody Item item) {
        try {
            return ResponseEntity.ok(itemService.createItem(item));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/items/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(
            @PathVariable Long id, 
            @RequestBody Item item) {
        try {
            return ResponseEntity.ok(
                itemService.updateItem(id, item));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/items/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok(
                Map.of("message", "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}