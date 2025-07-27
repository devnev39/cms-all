package com.cms.cms.models.dto.Coupon;

import java.sql.Timestamp;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NewCouponDTO {
    @NotNull
    private Long couponTypeId; 

    @NotNull
    private Long userId;

    @NotNull
    private Integer count;

    @NotNull
    private Timestamp validity;
}
