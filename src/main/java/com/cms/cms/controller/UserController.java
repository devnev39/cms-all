package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.common.Roles;
import com.cms.cms.models.dto.UserDTO;
import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private UserRepository repo;
    private RoleRepository roleRepo;

    @GetMapping("")
    public List<User> getAllUsers() {
        // Get logged in user's role
        // If the role is ROLE_ADMIN return ROLE_CLNT users
        // If the role is ROLE_CLNT return only client's own user
        // If the role is ROLE_CSTMR return only customer's own user
        if (CurrentUser.hasRole(Roles.ROLE_ADMIN)) {
            return repo.findAll();
        }
        return Collections.singletonList(getCurrentUser());
    }

    @GetMapping("/self")
    public User getCurrentUser(){
        // UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // System.out.println(user.getAuthorities());
        User u = repo.findById(CurrentUser.getCurrentUserId()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
        u.setPassword("");
        return u;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) throws CustomEntityNotFoundException {
        Optional<User> user = repo.findById(id);
        if (!user.isPresent()) throw new CustomEntityNotFoundException("User");
        return user.get();
    }

    @PostMapping("")
    public User createUser(@RequestBody User u) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        u.setPassword(encoder.encode(u.getPassword()));
        return repo.save(u);
    }

    @PatchMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDTO user) {
        // If user is admin, allow cross updates
        // Otherwise only allow updates to current user
        if (!CurrentUser.hasRole(Roles.ROLE_ADMIN) && CurrentUser.getCurrentUserId() != id) throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Not authorized !");
        Optional<User> u = repo.findById(id);
        if (!u.isPresent()) throw new CustomEntityNotFoundException("User");
        else {
            User present_user = u.get();
            if (user.getName().isPresent()) {
                present_user.setName(user.getName().get());
            }
            if (user.getEmail().isPresent()) {
                present_user.setEmail(user.getEmail().get());
            }
            if (user.getMobile().isPresent()) {
                present_user.setMobile(user.getMobile().get());
            }
            if (user.getRoleId().isPresent()) {
                // present_user.setRoleId(user.getRoleId().get());
                // get the role
                // set the role
                Role role = roleRepo.findById(user.getRoleId().get()).orElseThrow(() -> new CustomEntityNotFoundException("Role"));
                present_user.setRole(role);
            }

            // Default updates
            present_user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            present_user.setUpdatedBy(("#user"));
            return repo.save(present_user);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteUser(@PathVariable Long id) {
        // Only admin can delete another user
        // User cannot delete itself
        if (!CurrentUser.hasRole(Roles.ROLE_ADMIN)) throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Not authorized !");
        repo.deleteById(id);
        return new OperationResponse("User deleted successfully !");
    }
}
