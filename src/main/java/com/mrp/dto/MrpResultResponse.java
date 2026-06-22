 
package com.mrp.dto;

import java.util.List;

/**
 * DTO returned by GET /api/mrp/explode/{itemId}
 */
public class MrpResultResponse {

    private String productId;
    private String productName;
    private int requestedQuantity;
    private List<MrpLineItem> items;

    public MrpResultResponse() {}

    public MrpResultResponse(String productId, String productName,
                              int requestedQuantity, List<MrpLineItem> items) {
        this.productId = productId;
        this.productName = productName;
        this.requestedQuantity = requestedQuantity;
        this.items = items;
    }

    public String getProductId()                       { return productId; }
    public void setProductId(String productId)         { this.productId = productId; }

    public String getProductName()                     { return productName; }
    public void setProductName(String productName)     { this.productName = productName; }

    public int getRequestedQuantity()                          { return requestedQuantity; }
    public void setRequestedQuantity(int requestedQuantity)    { this.requestedQuantity = requestedQuantity; }

    public List<MrpLineItem> getItems()                { return items; }
    public void setItems(List<MrpLineItem> items)      { this.items = items; }

    // ── Nested response class ─────────────────────────────────────────────────

    public static class MrpLineItem {

        private String itemId;
        private String itemName;
        private String sku;
        private int grossRequirement;
        private int onHand;
        private int netRequirement;

        public MrpLineItem() {}

        public MrpLineItem(String itemId, String itemName, String sku,
                           int grossRequirement, int onHand, int netRequirement) {
            this.itemId = itemId;
            this.itemName = itemName;
            this.sku = sku;
            this.grossRequirement = grossRequirement;
            this.onHand = onHand;
            this.netRequirement = netRequirement;
        }

        public String getItemId()                      { return itemId; }
        public void setItemId(String itemId)           { this.itemId = itemId; }

        public String getItemName()                    { return itemName; }
        public void setItemName(String itemName)       { this.itemName = itemName; }

        public String getSku()                         { return sku; }
        public void setSku(String sku)                 { this.sku = sku; }

        public int getGrossRequirement()                           { return grossRequirement; }
        public void setGrossRequirement(int grossRequirement)      { this.grossRequirement = grossRequirement; }

        public int getOnHand()                         { return onHand; }
        public void setOnHand(int onHand)              { this.onHand = onHand; }

        public int getNetRequirement()                         { return netRequirement; }
        public void setNetRequirement(int netRequirement)      { this.netRequirement = netRequirement; }
    }
}
