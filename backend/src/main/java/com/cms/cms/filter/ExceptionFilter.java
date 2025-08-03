package com.cms.cms.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ExceptionFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Map<String, String> mp = new HashMap<>();
        try {
            filterChain.doFilter(request, response);   
        } catch (JwtException jw_ex) {
            jw_ex.printStackTrace();
            mp.put("error", "JWT Error !");
            mp.put("detail", jw_ex.getMessage());
            response.setStatus(401);
            response.getWriter().write(convertObjectToJson(mp));
        } catch (CustomEntityNotFoundException ex) {
            System.out.println("CustomException occured !");
            ex.printStackTrace();
            mp.put("error", "Internal server error");
            mp.put("detail", ex.getMessage());
            response.setStatus(401);
            response.getWriter().write(convertObjectToJson(mp)); 
        }
        // catch (HttpClientErrorException ex) {
        //     System.out.println("Exception occured !");
        //     ex.printStackTrace();
        //     mp.put("error", "Client Error");
        //     mp.put("detail", ex.getLocalizedMessage());
        //     response.setStatus(ex.getStatusCode().value());
        //     response.getWriter().write(convertObjectToJson(mp));
        // }
        // catch (Exception ex) {
        //     System.out.println("Exception occured !");
        //     ex.printStackTrace();
        //     mp.put("error", "Internal server error");
        //     mp.put("detail", ex.getMessage());
        //     response.setStatus(500);
        //     response.getWriter().write(convertObjectToJson(mp));
        // }
    }

    public String convertObjectToJson(Object obj) throws JsonProcessingException {
        if (obj == null) return null;
        ObjectMapper mp = new ObjectMapper();
        return mp.writeValueAsString(obj);
    }
}
