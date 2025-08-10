package com.cms.cms.models.entity;

import java.sql.Timestamp;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @ManyToOne
    @JsonBackReference
    private Order order;

    @OneToMany(mappedBy = "coupon", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<CouponUsage> couponUsage;

    @Column(columnDefinition = "char(20)")
    private String couponType;

    private int couponTypeMinCount;

    private double couponTypeOriginalPrice;

    private double couponTypeDiscountPerCoupon;

    private int count;

    private Timestamp validity;
}
