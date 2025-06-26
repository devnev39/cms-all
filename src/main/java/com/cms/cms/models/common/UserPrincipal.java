package com.cms.cms.models.common;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;

import lombok.Getter;

@Getter
public class UserPrincipal implements UserDetails{

    private final User user;
    private final Role role;

    public UserPrincipal(User u, Role r) {
        this.user = u;
        this.role  = r;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return Collections.singleton(new SimpleGrantedAuthority(this.role.getType()));
    }

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return user.getEmail();
    }
}
