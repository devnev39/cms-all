package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.OrderDTO;
import com.cms.cms.models.entity.Order;
import com.cms.cms.repository.OrderRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OderController {
    
    private OrderRepository repo;

    @GetMapping("")
    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        Optional<Order> order = repo.findById(id);
        if (!order.isPresent()) throw new CustomEntityNotFoundException("Order");
        return order.get();
    }

    @PostMapping("")
    public Order createOrder(@RequestBody Order order) {
        order.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
        return repo.save(order);
    }

    @PatchMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
        Optional<Order> order = repo.findById(id);
        if (!order.isPresent()) throw new CustomEntityNotFoundException("Order"); 
        else {
            Order current = order.get();
            if (dto.getTotalAmount().isPresent()) {
                current.setTotalAmount(dto.getTotalAmount().get());
            }

            current.setUpdatedBy(CurrentUser.getCurrentUser().getEmail());
            current.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            return current;
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteOrder(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Order deleted successfully !");
    }
}
