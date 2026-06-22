package com.mrp.repository;

import com.mrp.entity.BomLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BomLinkRepository
        extends JpaRepository<BomLink, Long> {

    List<BomLink> findByParentItem_Id(Long parentItemId);

    List<BomLink> findByChildItem_Id(Long childItemId);

    boolean existsByParentItem_IdAndChildItem_Id(
        Long parentItemId, Long childItemId);
}