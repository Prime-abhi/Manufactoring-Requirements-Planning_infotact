package com.mrp.service;

import com.mrp.entity.Item;
import com.mrp.entity.PurchaseOrder;
import com.mrp.repository.ItemRepository;
import com.mrp.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PurchaseOrderService {

	private final PurchaseOrderRepository purchaseOrderRepository;
    private final ItemRepository itemRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                ItemRepository itemRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.itemRepository = itemRepository;
    }

    // Get all purchase orders
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    // Get by status
    public List<PurchaseOrder> getByStatus(
            PurchaseOrder.Status status) {
        return purchaseOrderRepository
            .findByStatus(status);
    }

    // Get one by ID
    public PurchaseOrder getById(Long id) {
        return purchaseOrderRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException(
                    "Purchase Order not found"));
    }

    // Create PO manually
    public PurchaseOrder createPurchaseOrder(
            Long itemId, Double quantity,
            PurchaseOrder.Reason reason) {

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Item not found"));

        if (quantity <= 0) {
            throw new RuntimeException(
                "Quantity must be greater than 0");
        }

        PurchaseOrder po = new PurchaseOrder();
        po.setItem(item);
        po.setQuantity(quantity);
        po.setSupplierName(item.getSupplierName());
        po.setReason(reason);
        po.setStatus(PurchaseOrder.Status.CREATED);

        return purchaseOrderRepository.save(po);
    }

    // Auto create PO when stock is low
    public PurchaseOrder autoCreateForLowStock(
            Long itemId) {

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Item not found"));

        // Calculate how much to order
        double shortage = item.getMinimumStockLimit()
            - item.getAvailableQuantity();

        if (shortage <= 0) {
            throw new RuntimeException(
                "Item is not low on stock");
        }

        PurchaseOrder po = new PurchaseOrder();
        po.setItem(item);
        po.setQuantity(shortage);
        po.setSupplierName(item.getSupplierName());
        po.setReason(
            PurchaseOrder.Reason.LOW_STOCK);
        po.setStatus(PurchaseOrder.Status.CREATED);

        return purchaseOrderRepository.save(po);
    }

    // Auto create PO for production shortage
    public PurchaseOrder autoCreateForProductionShortage(
            Long itemId, Double shortageQuantity) {

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Item not found"));

        PurchaseOrder po = new PurchaseOrder();
        po.setItem(item);
        po.setQuantity(shortageQuantity);
        po.setSupplierName(item.getSupplierName());
        po.setReason(
            PurchaseOrder.Reason.PRODUCTION_SHORTAGE);
        po.setStatus(PurchaseOrder.Status.CREATED);

        return purchaseOrderRepository.save(po);
    }

    // Approve PO
    public PurchaseOrder approvePO(Long id) {
        PurchaseOrder po = getById(id);

        if (po.getStatus() !=
                PurchaseOrder.Status.CREATED) {
            throw new RuntimeException(
                "Only CREATED orders can be approved");
        }

        po.setStatus(PurchaseOrder.Status.APPROVED);
        return purchaseOrderRepository.save(po);
    }

    // Cancel PO
    public PurchaseOrder cancelPO(Long id) {
        PurchaseOrder po = getById(id);

        if (po.getStatus() ==
                PurchaseOrder.Status.APPROVED) {
            throw new RuntimeException(
                "Approved orders cannot be cancelled");
        }

        po.setStatus(PurchaseOrder.Status.CANCELLED);
        return purchaseOrderRepository.save(po);
    }

    // Count open POs
    public long countOpen() {
        return purchaseOrderRepository
            .countByStatus(
                PurchaseOrder.Status.CREATED);
    }
}