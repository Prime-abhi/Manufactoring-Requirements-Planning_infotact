package com.mrp.service;

import com.mrp.entity.Item;
import com.mrp.entity.ProductionRequest;
import com.mrp.entity.User;
import com.mrp.repository.ItemRepository;
import com.mrp.repository.ProductionRequestRepository;
import com.mrp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductionRequestService {

    private final ProductionRequestRepository productionRequestRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ProductionRequestService(ProductionRequestRepository productionRequestRepository, ItemRepository itemRepository, UserRepository userRepository) {
        this.productionRequestRepository = productionRequestRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public List<ProductionRequest> getAllRequests() { return productionRequestRepository.findAll(); }

    public List<ProductionRequest> getMyRequests(Long userId) { return productionRequestRepository.findByRequestedById(userId); }

    public ProductionRequest createRequest(Long itemId, Integer quantity, Long requestedById, String notes) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        User requestedBy = userRepository.findById(requestedById).orElseThrow(() -> new RuntimeException("User not found"));
        if (item.getItemType() != Item.ItemType.FINISHED_GOOD) throw new RuntimeException("Production requests can only be created for Finished Goods");
        if (quantity <= 0) throw new RuntimeException("Quantity must be greater than 0");
        ProductionRequest request = new ProductionRequest();
        request.setItem(item);
        request.setRequestedQuantity(quantity);
        request.setRequestedBy(requestedBy);
        request.setNotes(notes);
        request.setStatus(ProductionRequest.Status.PENDING);
        return productionRequestRepository.save(request);
    }

    public ProductionRequest approveRequest(Long requestId, Long managerId) {
        ProductionRequest request = productionRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        if (request.getStatus() != ProductionRequest.Status.PENDING) throw new RuntimeException("Only PENDING requests can be approved");
        User manager = userRepository.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        request.setStatus(ProductionRequest.Status.APPROVED);
        request.setApprovedBy(manager);
        request.setApprovedAt(LocalDateTime.now());
        return productionRequestRepository.save(request);
    }

    public ProductionRequest rejectRequest(Long requestId, Long managerId, String reason) {
        ProductionRequest request = productionRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        if (request.getStatus() != ProductionRequest.Status.PENDING) throw new RuntimeException("Only PENDING requests can be rejected");
        User manager = userRepository.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        request.setStatus(ProductionRequest.Status.REJECTED);
        request.setApprovedBy(manager);
        request.setApprovedAt(LocalDateTime.now());
        request.setNotes(reason);
        return productionRequestRepository.save(request);
    }

    public long countPending() { return productionRequestRepository.countByStatus(ProductionRequest.Status.PENDING); }
}
