 
package com.mrp.entity;

/**
 * BomLine entity — one line in a Bill of Materials.
 * Links a parent finished good to one of its required components.
 */
public class BomLine {

    private String id;
    private String parentProductId;
    private String componentProductId;
    private int quantityPer;  // qty of component needed per 1 unit of parent

    public BomLine() {}

    public BomLine(String id, String parentProductId, String componentProductId, int quantityPer) {
        this.id = id;
        this.parentProductId = parentProductId;
        this.componentProductId = componentProductId;
        this.quantityPer = quantityPer;
    }

    public String getId()                        { return id; }
    public void setId(String id)                 { this.id = id; }

    public String getParentProductId()                       { return parentProductId; }
    public void setParentProductId(String parentProductId)   { this.parentProductId = parentProductId; }

    public String getComponentProductId()                        { return componentProductId; }
    public void setComponentProductId(String componentProductId) { this.componentProductId = componentProductId; }

    public int getQuantityPer()                  { return quantityPer; }
    public void setQuantityPer(int quantityPer)  { this.quantityPer = quantityPer; }
}
