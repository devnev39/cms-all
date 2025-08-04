package com.cms.cms.models.dto.Coupon;

import java.sql.Timestamp;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// This DTO is used to update a coupon
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CouponDTO {
    private Optional<Long> customerId = Optional.empty();
    private Optional<Integer> count = Optional.empty();
    private Optional<Timestamp> validity = Optional.empty(); 
}
