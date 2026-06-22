package com.mrp.dto;

import java.util.List;
import java.util.Map;

public class BomExplosionResult {

    private Long itemId;
    private String itemName;
    private Double quantity;
    private List<Map<String, Object>> children;

    public BomExplosionResult() {}

    public Long getItemId()                            { return itemId; }
    public void setItemId(Long itemId)                 { this.itemId = itemId; }

    public String getItemName()                        { return itemName; }
    public void setItemName(String itemName)           { this.itemName = itemName; }

    public Double getQuantity()                        { return quantity; }
    public void setQuantity(Double quantity)           { this.quantity = quantity; }

    public List<Map<String, Object>> getChildren()              { return children; }
    public void setChildren(List<Map<String, Object>> children) { this.children = children; }
}
