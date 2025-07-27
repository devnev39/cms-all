package com.cms.cms.utils;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository repo;

    private RoleRepository roleRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        User u = repo.findByEmail(username);
        System.out.println(u);
        if (u == null) throw new CustomEntityNotFoundException("User");
        Role r = roleRepo.findById(u.getRoleId()).orElseThrow(() -> new CustomEntityNotFoundException("Role"));
        return new UserPrincipal(u, r);
    }
    
}
