package com.cms.cms.models.dto;

import java.sql.Timestamp;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CouponDTO {
    private Optional<Long> couponTypeId = Optional.empty();
    private Optional<Long> userId = Optional.empty();
    private Optional<Integer> count = Optional.empty();
    private Optional<Timestamp> validity = Optional.empty(); 
}
