package com.mrp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String sku;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    private String unit;

    @Column(name = "available_quantity")
    private Double availableQuantity = 0.0;

    @Column(name = "minimum_stock_limit")
    private Double minimumStockLimit = 0.0;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "supplier_name")
    private String supplierName;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AVAILABLE;

    private String description;

    public enum ItemType {
        FINISHED_GOOD, SUB_ASSEMBLY, RAW_MATERIAL
    }

    public enum Status {
        AVAILABLE, LOW_STOCK
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Double availableQuantity) {
        this.availableQuantity = availableQuantity;
        updateStatus();
    }

    public Double getMinimumStockLimit() { return minimumStockLimit; }
    public void setMinimumStockLimit(Double minimumStockLimit) {
        this.minimumStockLimit = minimumStockLimit;
        updateStatus();
    }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { 
        this.supplierName = supplierName; 
    }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { 
        this.description = description; 
    }

    // Auto update status when quantity changes
    private void updateStatus() {
        if (this.availableQuantity != null 
                && this.minimumStockLimit != null) {
            if (this.availableQuantity < this.minimumStockLimit) {
                this.status = Status.LOW_STOCK;
            } else {
                this.status = Status.AVAILABLE;
            }
        }
    }
}