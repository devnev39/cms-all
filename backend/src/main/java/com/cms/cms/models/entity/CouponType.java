package com.cms.cms.models.entity;

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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CouponType extends Commons{
   private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;

   @ManyToOne
   private Caterer caterer;

   @Column(columnDefinition = "char(20)")
   private String type;

   private int minCount;
   private double originalPrice;
   private double discountPerCoupon;
}
