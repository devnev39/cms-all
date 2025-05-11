package com.cms.cms.models.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends Commons {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    Long roleId;
    String name;
    String email;
    String password;
    String mobile;

    public User(String email, Long id) {
        this.email = email;
        this.id = id;
    }
}
