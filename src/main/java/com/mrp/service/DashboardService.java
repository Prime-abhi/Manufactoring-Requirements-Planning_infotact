package com.mrp.service;

import com.mrp.dto.DashboardSummary;
import com.mrp.repository.BomLinkRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ItemService itemService;
    private final BomLinkRepository bomLinkRepository;

    public DashboardService(ItemService itemService,
                            BomLinkRepository bomLinkRepository) {
        this.itemService = itemService;
        this.bomLinkRepository = bomLinkRepository;
    }

    public DashboardSummary getSummary() {
        long totalItems    = itemService.countAll();
        long lowStockItems = itemService.countLowStock();
        long totalBomLinks = bomLinkRepository.count();
        return new DashboardSummary(totalItems, lowStockItems, totalBomLinks);
    }
}
