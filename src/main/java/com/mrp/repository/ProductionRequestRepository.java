package com.mrp.repository;

import com.mrp.entity.ProductionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductionRequestRepository
        extends JpaRepository<ProductionRequest, Long> {

    // Get all requests by a specific user
    List<ProductionRequest> findByRequestedById(
        Long userId);

    // Get all requests by status
    List<ProductionRequest> findByStatus(
        ProductionRequest.Status status);

    // Count pending requests
    long countByStatus(ProductionRequest.Status status);
}