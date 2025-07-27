package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    
}
