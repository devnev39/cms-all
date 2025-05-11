package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
import com.cms.cms.models.dto.UserDTO;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.UserRepository;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository repo;

    @GetMapping("")
    public List<User> getAllUsers() {
        return repo.findAll();
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
                present_user.setRoleId(user.getRoleId().get());
            }

            // Default updates
            present_user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            present_user.setUpdatedBy(("#user"));
            return repo.save(present_user);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("User deleted successfully !");
    }
}
