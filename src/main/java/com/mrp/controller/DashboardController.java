package com.mrp.controller;

import com.mrp.dto.DashboardSummary;
import com.mrp.entity.Item;
import com.mrp.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final ItemService itemService;

    public DashboardController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * GET /api/dashboard/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        List<Item> allItems      = itemService.getAllItems();
        List<Item> lowStockList  = itemService.getLowStockItems();

        long totalItems    = itemService.countAll();
        long lowStockItems = itemService.countLowStock();

        long finishedGoods = allItems.stream()
            .filter(i -> i.getItemType() == Item.ItemType.FINISHED_GOOD)
            .count();

        long rawMaterials  = allItems.stream()
            .filter(i -> i.getItemType() == Item.ItemType.RAW_MATERIAL)
            .count();

        long subAssemblies = allItems.stream()
            .filter(i -> i.getItemType() == Item.ItemType.SUB_ASSEMBLY)
            .count();

        // recentRuns — finished goods as placeholder runs
        List<Map<String, Object>> recentRuns = allItems.stream()
            .filter(i -> i.getItemType() == Item.ItemType.FINISHED_GOOD)
            .map(i -> Map.<String, Object>of(
                "product", i.getName(),
                "qty",     i.getAvailableQuantity() != null ? i.getAvailableQuantity().intValue() : 0,
                "result",  "Available",
                "date",    "—"
            ))
            .collect(Collectors.toList());

        // lowStockMaterials
        List<Map<String, Object>> lowStockMaterials = lowStockList.stream()
            .map(i -> Map.<String, Object>of(
                "material",  i.getName(),
                "available", i.getAvailableQuantity() != null ? i.getAvailableQuantity().intValue() : 0,
                "reorder",   i.getMinimumStockLimit()  != null ? i.getMinimumStockLimit().intValue()  : 0,
                "status",    (i.getAvailableQuantity() != null && i.getMinimumStockLimit() != null
                                && i.getAvailableQuantity() < i.getMinimumStockLimit() * 0.5)
                             ? "CRITICAL" : "LOW STOCK"
            ))
            .collect(Collectors.toList());

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalItems(totalItems);
        summary.setFinishedGoods(finishedGoods);
        summary.setRawMaterials(rawMaterials);
        summary.setSubAssemblies(subAssemblies);
        summary.setLowStockItems(lowStockItems);
        summary.setRecentRuns(recentRuns);
        summary.setLowStockMaterials(lowStockMaterials);

        return ResponseEntity.ok(summary);
    }
}
