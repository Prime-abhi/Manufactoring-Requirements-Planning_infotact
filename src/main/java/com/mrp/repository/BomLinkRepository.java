package com.mrp.repository;

import com.mrp.entity.BomLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BomLinkRepository
        extends JpaRepository<BomLink, Long> {

    List<BomLink> findByParentItemId(Long parentItemId);

    List<BomLink> findByChildItemId(Long childItemId);

    boolean existsByParentItemIdAndChildItemId(
        Long parentItemId, Long childItemId);
}