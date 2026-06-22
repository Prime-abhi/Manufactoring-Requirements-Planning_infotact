package com.mrp.service;

import com.mrp.entity.ProductionRequest;
import com.mrp.repository.ProductionRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProductionRequestService {

    private final ProductionRequestRepository repository;

    public ProductionRequestService(ProductionRequestRepository repository) {
        this.repository = repository;
    }

    public List<ProductionRequest> getAll() {
        return repository.findAll();
    }

    public Optional<ProductionRequest> getById(Long id) {
        return repository.findById(id);
    }

    public ProductionRequest create(ProductionRequest req) {
        if (req.getRequestDate() == null) {
            req.setRequestDate(LocalDate.now());
        }
        return repository.save(req);
    }

    public Optional<ProductionRequest> updateStatus(Long id, ProductionRequest.Status status) {
        return repository.findById(id).map(r -> {
            r.setStatus(status);
            return repository.save(r);
        });
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Production request not found: " + id);
        }
        repository.deleteById(id);
    }
}
