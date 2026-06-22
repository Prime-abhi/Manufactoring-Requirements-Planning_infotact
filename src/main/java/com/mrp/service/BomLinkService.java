package com.mrp.service;

import com.mrp.entity.BomLink;
import com.mrp.entity.Item;
import com.mrp.repository.BomLinkRepository;
import com.mrp.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BomLinkService {

	private final BomLinkRepository bomLinkRepository;
	private final ItemRepository itemRepository;

	public BomLinkService(BomLinkRepository bomLinkRepository, ItemRepository itemRepository) {
	    this.bomLinkRepository = bomLinkRepository;
	    this.itemRepository = itemRepository;
	}

    // Create BOM link
    public BomLink createLink(Long parentId,
            Long childId, Double quantity) {

        Item parent = itemRepository.findById(parentId)
            .orElseThrow(() ->
                new RuntimeException("Parent item not found"));

        Item child = itemRepository.findById(childId)
            .orElseThrow(() ->
                new RuntimeException("Child item not found"));

        if (parentId.equals(childId))
            throw new RuntimeException(
                "Item cannot be its own child");

        if (bomLinkRepository
                .existsByParentItem_IdAndChildItem_Id(
                    parentId, childId))
            throw new RuntimeException(
                "This BOM link already exists");

        BomLink link = new BomLink();
        link.setParentItem(parent);
        link.setChildItem(child);
        link.setQuantityRequired(quantity);

        return bomLinkRepository.save(link);
    }

    // Get all links
    public List<BomLink> getAllLinks() {
        return bomLinkRepository.findAll();
    }

    // Get direct children of an item
    public List<BomLink> getChildren(Long parentId) {
        return bomLinkRepository
            .findByParentItem_Id(parentId);
    }

    // Get full recursive tree
    public Map<String, Object> getTree(Long itemId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() ->
                new RuntimeException("Item not found"));
        return buildNode(item, 1.0, new HashSet<>());
    }

    // Recursive tree builder
    private Map<String, Object> buildNode(
            Item item, Double quantity,
            Set<Long> visited) {

        Map<String, Object> node = new LinkedHashMap<>();
        node.put("id", item.getId());
        node.put("name", item.getName());
        node.put("sku", item.getSku());
        node.put("type", item.getItemType());
        node.put("availableQty", item.getAvailableQuantity());
        node.put("minimumStockLimit",
            item.getMinimumStockLimit());
        node.put("unit", item.getUnit());
        node.put("quantity", quantity);
        node.put("status", item.getStatus());

        // Prevent circular reference
        if (visited.contains(item.getId())) {
            node.put("children", new ArrayList<>());
            return node;
        }

        Set<Long> newVisited = new HashSet<>(visited);
        newVisited.add(item.getId());

        List<BomLink> childLinks = bomLinkRepository
            .findByParentItem_Id(item.getId());

        List<Map<String, Object>> children =
            new ArrayList<>();

        for (BomLink link : childLinks) {
            children.add(buildNode(
                link.getChildItem(),
                link.getQuantityRequired(),
                newVisited
            ));
        }

        node.put("children", children);
        return node;
    }

    // Delete link
    public void deleteLink(Long id) {
        if (!bomLinkRepository.existsById(id))
            throw new RuntimeException(
                "BOM link not found");
        bomLinkRepository.deleteById(id);
    }
}