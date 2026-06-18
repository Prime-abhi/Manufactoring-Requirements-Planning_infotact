package com.mrp.service;

import com.mrp.entity.Item;
import com.mrp.repository.ItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ItemService {

	
	private final ItemRepository itemRepository;

	public ItemService(ItemRepository itemRepository) {
	    this.itemRepository = itemRepository;
	}

    // Get all items
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // Get item by ID
    public Item getItemById(Long id) {
        return itemRepository.findById(id)
            .orElseThrow(() -> 
                new RuntimeException("Item not found with id: " + id));
    }

    // Get items by type
    public List<Item> getItemsByType(Item.ItemType type) {
        return itemRepository.findByItemType(type);
    }

    // Get low stock items
    public List<Item> getLowStockItems() {
        return itemRepository.findByStatus(Item.Status.LOW_STOCK);
    }

    // Create new item
    public Item createItem(Item item) {
        if (item.getSku() != null && 
                itemRepository.existsBySku(item.getSku())) {
            throw new RuntimeException(
                "Item with SKU " + item.getSku() + " already exists");
        }
        // Status auto-calculated in entity setter
        return itemRepository.save(item);
    }

    // Update item
    public Item updateItem(Long id, Item updatedItem) {
        Item existing = getItemById(id);

        existing.setName(updatedItem.getName());
        existing.setSku(updatedItem.getSku());
        existing.setItemType(updatedItem.getItemType());
        existing.setUnit(updatedItem.getUnit());
        existing.setAvailableQuantity(
            updatedItem.getAvailableQuantity());
        existing.setMinimumStockLimit(
            updatedItem.getMinimumStockLimit());
        existing.setUnitPrice(updatedItem.getUnitPrice());
        existing.setSupplierName(updatedItem.getSupplierName());
        existing.setDescription(updatedItem.getDescription());

        return itemRepository.save(existing);
    }

    // Delete item
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException(
                "Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    // Count items
    public long countAll() {
        return itemRepository.count();
    }

    public long countLowStock() {
        return itemRepository
            .findByStatus(Item.Status.LOW_STOCK).size();
    }
}