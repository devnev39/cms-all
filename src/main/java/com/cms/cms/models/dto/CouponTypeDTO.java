package com.cms.cms.models.dto;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CouponTypeDTO {
    private Optional<String> type = Optional.empty();
    // private Optional<String> catererId = Optional.empty();
    private Optional<Integer> minCount = Optional.empty();
    private Optional<Double> originalPrice = Optional.empty();
    private Optional<Double> discountPerCoupon = Optional.empty();
}
