package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
}
