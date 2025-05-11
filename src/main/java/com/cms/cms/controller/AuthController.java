package com.cms.cms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.dto.AuthResponse;
import com.cms.cms.services.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;
        
    @PostMapping("")
    public AuthResponse login(@RequestBody AuthBody body) throws Exception {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword())
        );

        if (auth.isAuthenticated()) {
            UserPrincipal user = (UserPrincipal) auth.getPrincipal();
            return new AuthResponse(
                jwtService.getJwtToken(user.getUser()),
                user.getUser()
            );
        }
        throw new Exception("Error occured !");
    }
}
