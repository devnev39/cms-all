package com.cms.cms.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoleService {
    private final RoleRepository repo; 
    private final ModelMapper mapper;

    public Role createRole(Role r) {
        return repo.save(r);
    }

    public List<Role> getAllRoles() {
        return repo.findAll();
    }

    public Role getCurrentRole() {
        Role r = repo.findRoleByType(CurrentUser.getCurrentRole().getType()).orElseThrow(
            () -> new CustomEntityNotFoundException("Role")
        );
        return r;
    }
}
