package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Coupon;

public interface CouponRepository extends JpaRepository <Coupon, Long> {
    
}
