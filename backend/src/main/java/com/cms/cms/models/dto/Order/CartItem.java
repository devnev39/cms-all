package com.cms.cms.models.dto.Order;

import com.cms.cms.models.entity.Item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    private Item item;
    private int count;
}
