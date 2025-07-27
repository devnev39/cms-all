package com.cms.cms.models.common;

import java.util.HashMap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperationResponse {
    private String message;
    private HashMap<String, Object> extra = null;

    public OperationResponse(String message) {
        this.message = message;
    }

    private void _addItem(String key, Object value) {
        if (extra == null) {
            extra = new HashMap<>();
        }
        extra.put(key, value);
    }

    public OperationResponse addItem(String key, Object value) {
        this._addItem(key, value);
        return this;
    }

    public static OperationResponse createResponse(String message) {
        return new OperationResponse(message);
    }
}
