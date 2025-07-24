package com.cms.cms.models.dto.OrderDetail;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {
    private Optional<Integer> quantity = Optional.empty();
    private Optional<Double>  pricePerUnit = Optional.empty();
    private Optional<Long> itemId = Optional.empty();
    private Optional<Long> orderId = Optional.empty();
}
