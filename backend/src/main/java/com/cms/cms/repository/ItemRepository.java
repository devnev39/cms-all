package com.cms.cms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCatererId(Long catererId);
    
}
