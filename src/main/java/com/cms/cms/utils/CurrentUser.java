package com.cms.cms.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.cms.cms.models.common.UserPrincipal;
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
}
