package com.cms.cms.controller;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.dto.AuthBody;
import com.cms.cms.models.dto.AuthResponse;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.utils.JwtService;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authManager;

    private JwtService jwtService;

    private RoleRepository repo;

    @GetMapping("")
    public ResponseEntity<?> login(@RequestHeader(value = "Authorization", required = false) String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Basic")) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("WWW-Authenticate", "Basic realm=\"Access to the auth\"");
            return new ResponseEntity<>("Auth required !", headers, HttpStatus.UNAUTHORIZED);
        }
        String base64Credentials = authHeader.substring("Basic ".length());
        byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(credDecoded, StandardCharsets.UTF_8);

        // Split username and password
        final String[] values = credentials.split(":", 2);
        if (values.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid auth format");
        }

        String username = values[0];
        String password = values[1];

        System.out.println(username);
        System.out.println(password);

        return new ResponseEntity<>(login(new AuthBody(username, password)), new HttpHeaders(), 200);
    } 

    // @GetMapping("")
    // public ResponseEntity<String> login() throws Exception {
    //     HttpHeaders headers = new HttpHeaders();
    //     headers.add("WWW-Authenticate", "Basic");
    //     return ResponseEntity.status(401).headers(headers).build();
    // }
        
    @PostMapping("")
    public ResponseEntity<?> login(@RequestBody AuthBody body) throws Exception {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword())
            );

            if (auth.isAuthenticated()) {
                UserPrincipal user = (UserPrincipal) auth.getPrincipal();
                Role role = repo.findById(user.getUser().getRoleId()).get();
                if (role == null) throw new CustomEntityNotFoundException("Role");
                return new ResponseEntity<AuthResponse>(
                    new AuthResponse(
                        jwtService.getJwtToken(user.getUser(), role),
                        user.getUser()
                    ),
                    HttpStatus.OK
                );
            }   
        } catch (BadCredentialsException e) {
            return new ResponseEntity<OperationResponse>(new OperationResponse("Invalid username or password !"), HttpStatus.UNAUTHORIZED);
        }
        throw new Exception("Error occured !");
    }
}

// $2a$10$v1Zz1CJnRpfIMIxDem8x2.zXi0u2IBjulHmebh7LAn3fuq76Ovk9C