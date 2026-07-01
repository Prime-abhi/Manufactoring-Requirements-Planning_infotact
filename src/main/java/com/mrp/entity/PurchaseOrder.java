package com.mrp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "po_number", unique = true,
        nullable = false)
    private String poNumber;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private Double quantity;

    @Column(name = "supplier_name")
    private String supplierName;

    @Enumerated(EnumType.STRING)
    private Status status = Status.CREATED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private Reason reason;

    public enum Status {
        CREATED, APPROVED, CANCELLED
    }

    public enum Reason {
        LOW_STOCK, PRODUCTION_SHORTAGE
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        // Auto generate PO number
        if (this.poNumber == null) {
            this.poNumber = "PO-" +
                System.currentTimeMillis();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }

    public Item getItem() { return item; }
    public void setItem(Item item) {
        this.item = item;
    }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getSupplierName() {
        return supplierName;
    }
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Status getStatus() { return status; }
    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Reason getReason() { return reason; }
    public void setReason(Reason reason) {
        this.reason = reason;
    }
}