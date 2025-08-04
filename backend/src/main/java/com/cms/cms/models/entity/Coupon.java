package com.cms.cms.models.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Coupon extends Commons {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Caterer caterer;
    
    @Column(columnDefinition = "char(5)")
    private String couponType;

    private int couponTypeMinCount;

    private double couponTypeOriginalPrice;

    private double couponTypeDiscountPerCoupon;
    
    private int count;

    private Timestamp validity;
}
