 
package com.mrp.entity;

/**
 * InventoryItem entity.
 * Tracks on-hand stock levels for a product.
 */
public class InventoryItem {

    private String id;
    private String productId;
    private String name;
    private String sku;
    private int available;
    private int minStock;
    private double unitPrice;

    public InventoryItem() {}

    public InventoryItem(String id, String productId, String name, String sku,
                         int available, int minStock, double unitPrice) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.sku = sku;
        this.available = available;
        this.minStock = minStock;
        this.unitPrice = unitPrice;
    }

    public String getId()                    { return id; }
    public void setId(String id)             { this.id = id; }

    public String getProductId()             { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName()                  { return name; }
    public void setName(String name)         { this.name = name; }

    public String getSku()                   { return sku; }
    public void setSku(String sku)           { this.sku = sku; }

    public int getAvailable()                { return available; }
    public void setAvailable(int available)  { this.available = available; }

    public int getMinStock()                 { return minStock; }
    public void setMinStock(int minStock)    { this.minStock = minStock; }

    public double getUnitPrice()                   { return unitPrice; }
    public void setUnitPrice(double unitPrice)      { this.unitPrice = unitPrice; }
}
