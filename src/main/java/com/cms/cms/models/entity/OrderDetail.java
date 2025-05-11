package com.cms.cms.models.entity;

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
public class OrderDetail extends Commons{
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private Long orderId;
    private Long itemId;
    private int quantity;
    private double pricePerUnit;
}
