package com.cms.cms.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.RoleDTO;
import com.cms.cms.models.entity.Role;
import com.cms.cms.service.RoleService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/role")
@CrossOrigin(origins = { "*" })
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping("")
    public Role createRole(@RequestBody Role r) {
        return roleService.createRole(r);
    }

    @GetMapping("")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/self")
    public Role getCurrentRole() {
        return roleService.getCurrentRole();
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @PatchMapping("/{id}")
    public Role updateRole(@PathVariable Long id, @RequestBody RoleDTO role) {
        return roleService.updateRole(id, role); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        if (roleService.deleteRole(id)) {
            return new ResponseEntity<OperationResponse>(new OperationResponse("Role deleted successfully !"), HttpStatus.OK);
        }
        return new ResponseEntity<OperationResponse>(new OperationResponse("Error occured !"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
