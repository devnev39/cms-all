package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.CouponType;

public interface CouponTypeRepository extends JpaRepository<CouponType, Long> {
    
}
