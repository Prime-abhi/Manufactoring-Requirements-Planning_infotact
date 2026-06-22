package com.mrp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "expected_delivery")
    private LocalDate expectedDelivery;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, ORDERED, RECEIVED, CANCELLED
    }

    public PurchaseOrder() {}

    public Long getId()                            { return id; }
    public void setId(Long id)                     { this.id = id; }

    public Long getItemId()                        { return itemId; }
    public void setItemId(Long itemId)             { this.itemId = itemId; }

    public Integer getQuantity()                   { return quantity; }
    public void setQuantity(Integer quantity)      { this.quantity = quantity; }

    public LocalDate getOrderDate()                { return orderDate; }
    public void setOrderDate(LocalDate d)          { this.orderDate = d; }

    public LocalDate getExpectedDelivery()         { return expectedDelivery; }
    public void setExpectedDelivery(LocalDate d)   { this.expectedDelivery = d; }

    public Status getStatus()                      { return status; }
    public void setStatus(Status status)           { this.status = status; }
}
