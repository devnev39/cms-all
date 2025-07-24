package com.cms.cms.controller;

import java.util.List;
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
import com.cms.cms.models.dto.User.NewUserDTO;
import com.cms.cms.models.dto.User.UserDTO;
import com.cms.cms.models.entity.User;
import com.cms.cms.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("")
    public List<User> getAllUsers() {
        // Get logged in user's role
        // If the role is ROLE_ADMIN return ROLE_CLNT users
        // If the role is ROLE_CLNT return only client's own user
        // If the role is ROLE_CSTMR return only customer's own user
        return userService.getAllUsers(); 
    }

    @GetMapping("/self")
    public User getCurrentUser(){
        // UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // System.out.println(user.getAuthorities());
        return userService.getCurrentUser();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) throws CustomEntityNotFoundException {
        return userService.getUserById(id);
    }

    @PostMapping("")
    public User createUser(@Valid @RequestBody NewUserDTO u) {
        return userService.createUser(u);
    }

    @PatchMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDTO user) {
        // If user is admin, allow cross updates
        // Otherwise only allow updates to current user
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteUser(@PathVariable Long id) {
        // Only admin can delete another user
        // User cannot delete itself
        if (userService.deleteUser(id)) {
            return OperationResponse.createResponse("User deleted successfully !").addItem("id", id).addItem("entity", "User");
        }
        return OperationResponse.createResponse("Failed !");
    }
}
