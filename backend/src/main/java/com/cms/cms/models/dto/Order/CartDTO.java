package com.cms.cms.models.dto.Order;

import java.util.List;

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
    private Long catererId;
}
