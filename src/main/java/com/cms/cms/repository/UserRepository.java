package com.cms.cms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    public User findByEmail(String email); 
}
