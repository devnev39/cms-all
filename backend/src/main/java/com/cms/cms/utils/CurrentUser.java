package com.cms.cms.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.cms.cms.models.common.Roles;
import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;

public class CurrentUser {

    public static Authentication getCurrentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
   
    public static UserPrincipal getCurrentPrincipal() {
        Authentication auth = getCurrentAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    public static User getCurrentUser() {
        return getCurrentPrincipal().getUser();
    }

    public static Role getCurrentRole() {
        return getCurrentPrincipal().getRole();
    }

    public static boolean hasRole(String role) {
        return getCurrentRole().getType().equals(role);
    }

    public static boolean hasRole(Roles role) {
        return hasRole(role.toString());
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
