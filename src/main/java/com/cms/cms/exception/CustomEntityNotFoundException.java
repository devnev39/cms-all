package com.cms.cms.exception;

import jakarta.persistence.EntityNotFoundException;

public class CustomEntityNotFoundException extends EntityNotFoundException{
    public CustomEntityNotFoundException(String entityName) {
        super(String.format("%s not found !", entityName));
    }
}
