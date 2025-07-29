package com.cms.cms.controller;

import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.InvalidInputException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.Order.NewOrderDTO;
import com.cms.cms.models.dto.Order.OrderDTO;
import com.cms.cms.models.entity.Order;
import com.cms.cms.service.OrderService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = { "http://localhost:5173" })
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;

	@GetMapping("")
	public List<Order> getAllOrders() {
		return orderService.getAllOrders();
	}

	@GetMapping("/{id}")
	public Order getOrderById(@PathVariable Long id) {
		return orderService.getOrderById(id);
	}

	@PostMapping("")
	public Order createOrder(@Valid @RequestBody NewOrderDTO order, BindingResult result) {
		if(result.hasErrors()) {
			throw new InvalidInputException("Order", result);
		}
		return orderService.createOrder(order);
	}

	@PatchMapping("/{id}")
	public Order updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
		return orderService.updateOrder(id, dto);
	}

	@DeleteMapping("/{id}")
	public OperationResponse deleteOrder(@PathVariable Long id) {
		return orderService.deleteOrder(id);
	}
}
