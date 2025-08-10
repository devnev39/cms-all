package com.cms.cms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Caterer;

public interface CatererRepository extends JpaRepository<Caterer, Long> {
    Optional<Caterer> findByUserId(Long userId);
}
