package com.cms.cms.service;

import org.springframework.stereotype.Service;

import com.cms.cms.models.entity.OrderDetail;
import com.cms.cms.repository.OrderDetailRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OrderDetailsService {
    private final OrderDetailRepository repo;

    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return repo.save(orderDetail);
    }

    public void deleteOrderDetail(Long id) {
        repo.deleteById(id);
    }
}
