package com.cms.cms.models.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Caterer extends Commons {
   private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
   private String name;

   @OneToOne
   private User user;

   private String razorpay_key;
   private String razorpay_secret;
}
