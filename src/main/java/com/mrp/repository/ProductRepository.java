 
package com.mrp.repository;

import com.mrp.entity.Product;
import com.mrp.entity.Product.ProductType;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * In-memory product store.
 * Swap this for a JPA repository when connecting to a real database.
 */
@Repository

public class ProductRepository  {

    private final List<Product> store = new ArrayList<>(List.of(
        new Product("p1", "Bicycle",      "BIC-001", ProductType.FINISHED_GOOD,  250.0),
        new Product("p2", "Mountain Bike","MTB-001", ProductType.FINISHED_GOOD,  450.0),
        new Product("p3", "Frame",        "FRM-001", ProductType.RAW_MATERIAL,    80.0),
        new Product("p4", "Wheel",        "WHL-001", ProductType.RAW_MATERIAL,    35.0),
        new Product("p5", "Chain",        "CHN-001", ProductType.RAW_MATERIAL,    15.0),
        new Product("p6", "Handlebar",    "HND-001", ProductType.RAW_MATERIAL,    20.0),
        new Product("p7", "Brake Set",    "BRK-001", ProductType.SUB_ASSEMBLY,    30.0),
        new Product("p8", "Gear System",  "GRS-001", ProductType.SUB_ASSEMBLY,    55.0)
    ));

    public List<Product> findAll() {
        return List.copyOf(store);
    }

    public List<Product> findByType(ProductType type) {
        return store.stream()
                .filter(p -> p.getType() == type)
                .toList();
    }

    public Optional<Product> findById(String string) {
        return store.stream().filter(p -> p.getId().equals(string)).findFirst();
    }
}
