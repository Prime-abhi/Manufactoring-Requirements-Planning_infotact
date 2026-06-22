package com.mrp.service;

import com.mrp.entity.PurchaseOrder;
import com.mrp.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository repository;

    public PurchaseOrderService(PurchaseOrderRepository repository) {
        this.repository = repository;
    }

    public List<PurchaseOrder> getAll() {
        return repository.findAll();
    }

    public Optional<PurchaseOrder> getById(Long id) {
        return repository.findById(id);
    }

    public PurchaseOrder create(PurchaseOrder po) {
        if (po.getOrderDate() == null) {
            po.setOrderDate(LocalDate.now());
        }
        return repository.save(po);
    }

    public Optional<PurchaseOrder> updateStatus(Long id, PurchaseOrder.Status status) {
        return repository.findById(id).map(p -> {
            p.setStatus(status);
            return repository.save(p);
        });
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Purchase order not found: " + id);
        }
        repository.deleteById(id);
    }
}
