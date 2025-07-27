package com.cms.cms.utils;

import java.util.Date;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.key}")
    private String jwtKey;

    private SecretKey getKey() {
        byte[] data = Base64.getDecoder().decode(jwtKey);
        return Keys.hmacShaKeyFor(data);
    }

    public String getJwtToken(User user, Role role) {
        Map<String, Object> hmap = new HashMap<>();
        hmap.put("id", user.getId());
        hmap.put("role", role.getType()); 
        hmap.put("role_id", role.getId()); 
        return Jwts.builder()
            .claims()
            .add(hmap)
            .subject(user.getEmail())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + (15*60*1000)))
            .and()
            .signWith(getKey())
            .compact();
    }

    public UserPrincipal getUser(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();

        if (claims.getExpiration().before(new Date(System.currentTimeMillis()))) {
            throw new ExpiredJwtException(null, null, "JWT Expired!");
        }
        
        return new UserPrincipal(new User(claims.getSubject(), ((Number) claims.get("id")).longValue()), new Role(((Number)claims.get("role_id")).longValue(),claims.get("role").toString()));
    }
}
