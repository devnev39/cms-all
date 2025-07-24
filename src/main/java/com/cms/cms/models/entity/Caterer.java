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

<<<<<<< HEAD
   @OneToOne
   private User user;
=======
   private Long userId;
>>>>>>> bf44378d5e1808f83d17be4d7b1faebb61ceb731

   private String razorpay_key;
   private String razorpay_secret;
}
