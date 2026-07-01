package com.mrp.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummary {

    private long   totalItems;
    private long   finishedGoods;
    private long   rawMaterials;
    private long   subAssemblies;
    private long   lowStockItems;
    private List<Map<String, Object>> recentRuns;
    private List<Map<String, Object>> lowStockMaterials;

    public DashboardSummary() {}

    public long getTotalItems()                            { return totalItems; }
    public void setTotalItems(long totalItems)             { this.totalItems = totalItems; }

    public long getFinishedGoods()                         { return finishedGoods; }
    public void setFinishedGoods(long finishedGoods)       { this.finishedGoods = finishedGoods; }

    public long getRawMaterials()                          { return rawMaterials; }
    public void setRawMaterials(long rawMaterials)         { this.rawMaterials = rawMaterials; }

    public long getSubAssemblies()                         { return subAssemblies; }
    public void setSubAssemblies(long subAssemblies)       { this.subAssemblies = subAssemblies; }

    public long getLowStockItems()                         { return lowStockItems; }
    public void setLowStockItems(long lowStockItems)       { this.lowStockItems = lowStockItems; }

    public List<Map<String, Object>> getRecentRuns()                           { return recentRuns; }
    public void setRecentRuns(List<Map<String, Object>> recentRuns)            { this.recentRuns = recentRuns; }

    public List<Map<String, Object>> getLowStockMaterials()                    { return lowStockMaterials; }
    public void setLowStockMaterials(List<Map<String, Object>> lowStockMaterials) { this.lowStockMaterials = lowStockMaterials; }
}
