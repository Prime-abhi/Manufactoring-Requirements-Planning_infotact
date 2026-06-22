 
package com.mrp.repository;

import com.mrp.entity.BomLine;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * In-memory BOM (Bill of Materials) store.
 */
@Repository
public class BomRepository {

    private final List<BomLine> store = List.of(
        // Bicycle (p1) BOM
        new BomLine("b1",  "p1", "p3", 1),  // 1 Frame
        new BomLine("b2",  "p1", "p4", 2),  // 2 Wheels
        new BomLine("b3",  "p1", "p5", 1),  // 1 Chain
        new BomLine("b4",  "p1", "p6", 1),  // 1 Handlebar
        new BomLine("b5",  "p1", "p7", 1),  // 1 Brake Set
        // Mountain Bike (p2) BOM
        new BomLine("b6",  "p2", "p3", 1),
        new BomLine("b7",  "p2", "p4", 2),
        new BomLine("b8",  "p2", "p5", 1),
        new BomLine("b9",  "p2", "p6", 1),
        new BomLine("b10", "p2", "p7", 1),
        new BomLine("b11", "p2", "p8", 1)   // 1 Gear System
    );

    public List<BomLine> findByParentProductId(String parentProductId) {
        return store.stream()
                .filter(b -> b.getParentProductId().equals(parentProductId))
                .toList();
    }
}
