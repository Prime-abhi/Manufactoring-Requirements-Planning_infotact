 
package com.mrp.service;

import com.mrp.dto.CreateInventoryRequest;
import com.mrp.entity.InventoryItem;
import com.mrp.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Optional<InventoryItem> getInventoryById(String id) {
        return inventoryRepository.findById(id);
    }

    /**
     * Add a new stock level entry.
     * Throws IllegalArgumentException if SKU already exists.
     */
    public InventoryItem addStockLevel(CreateInventoryRequest request) {
        if (inventoryRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException(
                "SKU '" + request.getSku().toUpperCase() + "' already exists in inventory"
            );
        }
        InventoryItem item = new InventoryItem(
            null,
            request.getProductId(),
            request.getName().trim(),
            request.getSku().toUpperCase().trim(),
            request.getAvailable(),
            request.getMinStock(),
            request.getUnitPrice()
        );
        return inventoryRepository.save(item);
    }

    /**
     * Update available quantity for an existing inventory item.
     * Returns empty if not found.
     */
    public Optional<InventoryItem> updateAvailableQty(String id, int newQty) {
        return inventoryRepository.findById(id).map(item -> {
            item.setAvailable(newQty);
            return inventoryRepository.save(item);
        });
    }
}
