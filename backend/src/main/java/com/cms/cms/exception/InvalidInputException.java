package com.cms.cms.exception;

import org.springframework.validation.BindingResult;

public class InvalidInputException extends RuntimeException {
    public InvalidInputException(String entity, BindingResult result) {
        super(formatMessage(entity, result));      
    } 

    private static String formatMessage(String entity, BindingResult result) {
        StringBuilder sb = new StringBuilder();
        sb.append("Invalid input for " + entity + ".");
        sb.append("Invalid fields: ");
        sb.append(String.join(",", result.getFieldErrors().stream().map((f) -> f.getField()).toList()));        
        return sb.toString();
    }
}
