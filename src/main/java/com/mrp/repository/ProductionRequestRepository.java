package com.mrp.repository;

import com.mrp.entity.ProductionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductionRequestRepository extends JpaRepository<ProductionRequest, Long> {

    List<ProductionRequest> findByRequestedById(Long userId);

    List<ProductionRequest> findByStatus(ProductionRequest.Status status);

    long countByStatus(ProductionRequest.Status status);
}
