package com.cms.cms.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.RoleDTO;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/role")
@CrossOrigin(origins = {"http://localhost:5173"})
@AllArgsConstructor
public class RoleController {

    private RoleRepository repo;

    @PostMapping("")
    public Role createRole(@RequestBody Role r) {
       return repo.save(r);
    }

    @GetMapping("")
    public List<Role> getAllRoles() {
        return repo.findAll();
    }

    @GetMapping("/self")
    public Role getCurrentRole() {
        Role r = repo.findRoleByType(CurrentUser.getCurrentRole().getType()).orElseThrow(
            () -> new CustomEntityNotFoundException("Role")
        );
        return r;
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable Long id) {
        Optional<Role> opt = repo.findById(id);
        if (opt.isPresent()) return opt.get();
        else throw new CustomEntityNotFoundException("Role");
    }

    @PatchMapping("/{id}")
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

    @DeleteMapping("/{id}")
    public OperationResponse deleteRole(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Role deleted successfully !");
    }
}
