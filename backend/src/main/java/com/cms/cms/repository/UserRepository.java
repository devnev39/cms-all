package com.cms.cms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    public User findByEmail(String email); 
    public List<User> findByRole(Role role);
}
