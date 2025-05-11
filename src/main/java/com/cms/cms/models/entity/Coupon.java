package com.cms.cms.models.entity;

import java.sql.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Long couponTypeId;
    private Long userId;
    private int count;
    private Timestamp validity;
}
