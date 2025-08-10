package com.cms.cms.models.dto.Order;

import java.util.List;

import com.cms.cms.models.entity.CouponType;
import com.cms.cms.models.entity.OrderType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartDTO {
    private List<CartItem> cartItems;
    private List<CouponType> coupons;
    private OrderType orderType;
    private Long catererId;
}
