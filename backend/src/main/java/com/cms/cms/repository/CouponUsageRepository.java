package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.CouponUsage;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    
}
