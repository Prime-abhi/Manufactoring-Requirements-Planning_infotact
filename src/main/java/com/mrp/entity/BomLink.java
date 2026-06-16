package com.mrp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bom_link")
public class BomLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_item_id", nullable = false)
    private Item parentItem;

    @ManyToOne
    @JoinColumn(name = "child_item_id", nullable = false)
    private Item childItem;

    @Column(nullable = false)
    private Double quantityRequired;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Item getParentItem() { return parentItem; }
    public void setParentItem(Item parentItem) { this.parentItem = parentItem; }

    public Item getChildItem() { return childItem; }
    public void setChildItem(Item childItem) { this.childItem = childItem; }

    public Double getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Double quantityRequired) { 
        this.quantityRequired = quantityRequired; 
    }
}