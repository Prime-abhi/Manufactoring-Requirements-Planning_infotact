package com.mrp.repository;

import com.mrp.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByItemId(Long itemId);
    List<PurchaseOrder> findByStatus(PurchaseOrder.Status status);
}
