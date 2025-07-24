package com.cms.cms.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class ExceptionAdvice {
    @ExceptionHandler({CustomEntityNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> entityNotFoundException(CustomEntityNotFoundException ex) {
        HashMap<String, String> hm = new HashMap<>();
        hm.put("message", ex.getMessage());
        return hm;
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<?> invalidInputException(InvalidInputException ex) {
        HashMap<String, String> hm = new HashMap<>();
        hm.put("message", ex.getMessage());
        return ResponseEntity.status(405).body(hm);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> bindException(CustomEntityNotFoundException ex) {
        HashMap<String, String> hm = new HashMap<>();
        hm.put("message", ex.getMessage());
        return ResponseEntity.status(500).body(hm);
    }
}
