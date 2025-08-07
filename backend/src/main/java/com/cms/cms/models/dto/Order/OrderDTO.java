package com.cms.cms.models.dto.Order;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Optional<Double> totalAmount = Optional.empty(); 
    private Optional<Boolean> isValid = Optional.empty();
}
