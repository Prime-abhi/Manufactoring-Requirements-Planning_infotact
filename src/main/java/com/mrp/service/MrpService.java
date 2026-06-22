 
package com.mrp.service;

import com.mrp.dto.MrpResultResponse;
import com.mrp.dto.MrpResultResponse.MrpLineItem;
import com.mrp.entity.BomLine;
import com.mrp.entity.Product;
import com.mrp.entity.Product.ProductType;
import com.mrp.repository.BomRepository;
import com.mrp.repository.InventoryRepository;
import com.mrp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MrpService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final BomRepository bomRepository;

    public MrpService(ProductRepository productRepository,
                      InventoryRepository inventoryRepository,
                      BomRepository bomRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.bomRepository = bomRepository;
    }

    /**
     * Single-level MRP explosion.
     *
     * grossRequirement = bomLine.quantityPer × requestedQty
     * onHand           = inventory.available (0 if no record)
     * netRequirement   = max(0, grossRequirement - onHand)
     *
     * @param productId  id of the FINISHED_GOOD
     * @param quantity   units to manufacture
     */
    public MrpResultResponse explode(String productId, int quantity) {
        // 1. Validate product
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new NoSuchElementException("Product '" + productId + "' not found"));

        if (product.getType() != ProductType.FINISHED_GOOD) {
            throw new IllegalArgumentException(
                "Product '" + product.getName() + "' is not a FINISHED_GOOD"
            );
        }

        // 2. Fetch BOM lines
        List<BomLine> bomLines = bomRepository.findByParentProductId(productId);
        if (bomLines.isEmpty()) {
            throw new NoSuchElementException(
                "No BOM defined for product '" + product.getName() + "'"
            );
        }

        // 3. Calculate per-component requirements
        List<MrpLineItem> items = bomLines.stream().map(line -> {
            Product component = productRepository.findById(line.getComponentProductId())
                .orElse(null);

            int grossRequirement = line.getQuantityPer() * quantity;
            int onHand = inventoryRepository.findByProductId(line.getComponentProductId())
                .map(InventoryItem -> InventoryItem.getAvailable())
                .orElse(0);
            int netRequirement = Math.max(0, grossRequirement - onHand);

            return new MrpLineItem(
                line.getComponentProductId(),
                component != null ? component.getName() : "Unknown",
                component != null ? component.getSku()  : null,
                grossRequirement,
                onHand,
                netRequirement
            );
        }).toList();

        return new MrpResultResponse(product.getId(), product.getName(), quantity, items);
    }
}
