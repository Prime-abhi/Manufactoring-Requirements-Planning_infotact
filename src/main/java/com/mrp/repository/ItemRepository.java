package com.mrp.repository;

import com.mrp.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByItemType(Item.ItemType itemType);

    List<Item> findByStatus(Item.Status status);

    List<Item> findByItemTypeAndStatus(
        Item.ItemType itemType, Item.Status status);

    boolean existsBySku(String sku);
}