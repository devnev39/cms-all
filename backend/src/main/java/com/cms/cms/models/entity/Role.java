package com.cms.cms.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Role {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id;
    @Column(columnDefinition = "char(10)")
    private String type;

    public Role(String type) {
        this.type = type;
    }
}
