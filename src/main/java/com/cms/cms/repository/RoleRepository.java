package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
}
