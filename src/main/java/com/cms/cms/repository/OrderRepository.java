package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
}
