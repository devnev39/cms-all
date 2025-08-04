package com.cms.cms.models.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "`order`")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Order extends Commons {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Caterer caterer;

    private double totalAmount;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String paymentMethod;
}
