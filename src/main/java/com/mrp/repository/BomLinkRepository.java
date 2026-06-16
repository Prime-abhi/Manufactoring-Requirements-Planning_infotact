package com.mrp.repository;

import com.mrp.entity.BomLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BomLinkRepository extends JpaRepository<BomLink, Long> {

    // Find all children of a parent item
    List<BomLink> findByParentItemId(Long parentItemId);

    // Find all parents of a child item
    List<BomLink> findByChildItemId(Long childItemId);

    // Check if link already exists
    boolean existsByParentItemIdAndChildItemId(
        Long parentItemId, Long childItemId);
}