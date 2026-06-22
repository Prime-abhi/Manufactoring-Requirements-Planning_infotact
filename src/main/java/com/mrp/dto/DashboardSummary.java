package com.mrp.dto;

public class DashboardSummary {

    private long totalItems;
    private long lowStockItems;
    private long totalBomLinks;

    public DashboardSummary() {}

    public DashboardSummary(long totalItems, long lowStockItems, long totalBomLinks) {
        this.totalItems = totalItems;
        this.lowStockItems = lowStockItems;
        this.totalBomLinks = totalBomLinks;
    }

    public long getTotalItems()                        { return totalItems; }
    public void setTotalItems(long totalItems)         { this.totalItems = totalItems; }

    public long getLowStockItems()                     { return lowStockItems; }
    public void setLowStockItems(long lowStockItems)   { this.lowStockItems = lowStockItems; }

    public long getTotalBomLinks()                     { return totalBomLinks; }
    public void setTotalBomLinks(long totalBomLinks)   { this.totalBomLinks = totalBomLinks; }
}
