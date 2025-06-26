package com.cms.cms.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.dto.AuthBody;
import com.cms.cms.models.dto.AuthResponse;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.services.JwtService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authManager;

    private JwtService jwtService;

    private RoleRepository repo;
        
    @PostMapping("")
    public AuthResponse login(@RequestBody AuthBody body) throws Exception {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword())
        );

        if (auth.isAuthenticated()) {
            UserPrincipal user = (UserPrincipal) auth.getPrincipal();
            Role role = repo.findById(user.getUser().getRoleId()).get();
            if (role == null) throw new CustomEntityNotFoundException("Role");
            return new AuthResponse(
                jwtService.getJwtToken(user.getUser(), role),
                user.getUser()
            );
        }
        throw new Exception("Error occured !");
    }
}
