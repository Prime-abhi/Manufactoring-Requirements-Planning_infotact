 
package com.mrp.repository;

import com.mrp.entity.InventoryItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * In-memory inventory store.
 * Swap this for a JPA repository when connecting to a real database.
 */
@Repository
public class InventoryRepository {

    private final List<InventoryItem> store = new ArrayList<>(List.of(
        new InventoryItem("inv1", "p3", "Frame",       "FRM-001", 120, 50,  80.0),
        new InventoryItem("inv2", "p4", "Wheel",       "WHL-001",  80, 100, 35.0),
        new InventoryItem("inv3", "p5", "Chain",       "CHN-001",  20, 100, 15.0),
        new InventoryItem("inv4", "p6", "Handlebar",   "HND-001", 200,  60, 20.0),
        new InventoryItem("inv5", "p7", "Brake Set",   "BRK-001",  45,  40, 30.0),
        new InventoryItem("inv6", "p8", "Gear System", "GRS-001",  10,  40, 55.0)
    ));

    public List<InventoryItem> findAll() {
        return List.copyOf(store);
    }

    public Optional<InventoryItem> findById(String id) {
        return store.stream().filter(i -> i.getId().equals(id)).findFirst();
    }

    public Optional<InventoryItem> findByProductId(String productId) {
        return store.stream().filter(i -> i.getProductId().equals(productId)).findFirst();
    }

    public boolean existsBySku(String sku) {
        return store.stream().anyMatch(i -> i.getSku().equalsIgnoreCase(sku));
    }

    /** Add a new inventory item and return it with a generated id. */
    public InventoryItem save(InventoryItem item) {
        if (item.getId() == null || item.getId().isBlank()) {
            item.setId(UUID.randomUUID().toString());
        }
        // Update existing
        for (int i = 0; i < store.size(); i++) {
            if (store.get(i).getId().equals(item.getId())) {
                store.set(i, item);
                return item;
            }
        }
        // Insert new
        store.add(item);
        return item;
    }
}
