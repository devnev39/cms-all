package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.Order.OrderDTO;
import com.cms.cms.models.entity.Order;
import com.cms.cms.repository.OrderRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OrderService {

	private final OrderRepository repo;

	public List<Order> getAllOrders() {
		return repo.findAll();
	}

	public Order getOrderById(Long id) {
		Optional<Order> order = repo.findById(id);
		if (!order.isPresent())
			throw new CustomEntityNotFoundException("Order");
		return order.get();
	}

	public Order createOrder(Order order) {
		order.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
		return repo.save(order);
	}

	public Order updateOrder(Long id, OrderDTO dto) {
		Optional<Order> order = repo.findById(id);
		if (!order.isPresent())
			throw new CustomEntityNotFoundException("Order");
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

	public OperationResponse deleteOrder(Long id) {
		repo.deleteById(id);
		return new OperationResponse("Order deleted successfully !");
	}
}
