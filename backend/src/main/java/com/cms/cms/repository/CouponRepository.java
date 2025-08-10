package com.cms.cms.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Coupon;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByCatererId(Long catererId);

    List<Coupon> findByCustomerId(Long customerId);
}
