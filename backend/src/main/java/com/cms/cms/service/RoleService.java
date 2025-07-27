package com.cms.cms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.transaction.annotation.Transactional;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.dto.RoleDTO;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class RoleService {
    private final RoleRepository repo; 

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

    public Role getRoleById(@PathVariable Long id) {
        Optional<Role> opt = repo.findById(id);
        if (opt.isPresent()) return opt.get();
        else throw new CustomEntityNotFoundException("Role");
    }

    public Role updateRole(@PathVariable Long id, @RequestBody RoleDTO role) {
        // Find role
        Optional<Role> opt = repo.findById(id);
        if (!opt.isPresent()) throw new CustomEntityNotFoundException("Role");
        else {
            Role present_role = opt.get();
            if (role.getType().isPresent()) present_role.setType(role.getType().get());

            // update the role
            return repo.save(present_role);
        }
    }

    public boolean deleteRole(@PathVariable Long id) {
        repo.deleteById(id);
        return true;
    }
}
