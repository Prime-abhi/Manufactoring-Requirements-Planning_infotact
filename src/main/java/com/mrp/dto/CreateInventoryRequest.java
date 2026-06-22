 
package com.mrp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for POST /api/inventory-status — add a new stock level entry.
 */
public class CreateInventoryRequest {

    @NotBlank(message = "productId is required")
    private String productId;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "sku is required")
    private String sku;

    @NotNull(message = "available is required")
    @Min(value = 0, message = "available must be >= 0")
    private Integer available;

    @NotNull(message = "minStock is required")
    @Min(value = 0, message = "minStock must be >= 0")
    private Integer minStock;

    @Min(value = 0, message = "unitPrice must be >= 0")
    private double unitPrice;

    public CreateInventoryRequest() {}

    public String getProductId()                   { return productId; }
    public void setProductId(String productId)     { this.productId = productId; }

    public String getName()                        { return name; }
    public void setName(String name)               { this.name = name; }

    public String getSku()                         { return sku; }
    public void setSku(String sku)                 { this.sku = sku; }

    public Integer getAvailable()                  { return available; }
    public void setAvailable(Integer available)    { this.available = available; }

    public Integer getMinStock()                   { return minStock; }
    public void setMinStock(Integer minStock)      { this.minStock = minStock; }

    public double getUnitPrice()                   { return unitPrice; }
    public void setUnitPrice(double unitPrice)     { this.unitPrice = unitPrice; }
}
