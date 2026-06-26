package com.mrp.entity;

/**
 * Product entity — in-memory representation.
 * Represents a raw material, sub-assembly, or finished good.
 */
public class Product {

    private String id;
    private String name;
    private String sku;
    private ProductType type;
    private double unitPrice;

    public enum ProductType {
        FINISHED_GOOD,
        RAW_MATERIAL,
        SUB_ASSEMBLY
    }

    public Product() {}

    public Product(String id, String name, String sku, ProductType type, double unitPrice) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.type = type;
        this.unitPrice = unitPrice;
    }

    public String getId()              { return id; }
    public void setId(String id)       { this.id = id; }

    public String getName()            { return name; }
    public void setName(String name)   { this.name = name; }

    public String getSku()             { return sku; }
    public void setSku(String sku)     { this.sku = sku; }

    public ProductType getType()               { return type; }
    public void setType(ProductType type)      { this.type = type; }

    public double getUnitPrice()               { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
}
