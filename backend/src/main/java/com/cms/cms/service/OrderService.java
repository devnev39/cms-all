package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.Order.CartDTO;
import com.cms.cms.models.dto.Order.CartItem;
import com.cms.cms.models.dto.Order.NewOrderDTO;
import com.cms.cms.models.dto.Order.OrderDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.Order;
import com.cms.cms.models.entity.OrderDetail;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.CatererRepository;
import com.cms.cms.repository.OrderDetailRepository;
import com.cms.cms.repository.OrderRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class OrderService {

	private final OrderRepository repo;
	private final ModelMapper mapper;
	private final UserRepository userRepo;
	private final CatererRepository catererRepo;
	private final OrderDetailRepository orderDetailRepo;

	public List<Order> getAllOrders() {
		return repo.findAll();
	}

	public Order getOrderById(Long id) {
		Optional<Order> order = repo.findById(id);
		if (!order.isPresent())
			throw new CustomEntityNotFoundException("Order");
		return order.get();
	}

	public Order createOrder(NewOrderDTO orderDTO) {
		Order order = mapper.map(orderDTO, Order.class);
		order.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
		return repo.save(order);
	}

	public List<Order> getOrdersByCustomerId(Long customerId) {
		return repo.findByCustomerId(customerId);
	}

	public List<Order> getOrdersByCatererId(Long catererId) {
		return repo.findByCatererId(catererId);
	}

	public Order createOrder(CartDTO entity) {
		// Create order object
		Order order = new Order();

		// get the current user (customer)
		User user = userRepo.findById(CurrentUser.getCurrentUserId()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
		order.setCustomer(user);

		Caterer caterer = catererRepo.findById(entity.getCatererId()).orElseThrow(() -> new CustomEntityNotFoundException("Caterer"));
		order.setCaterer(caterer);
		order.setCatererName(caterer.getName());
		order.setPaymentMethod("FREE");
		order.setRazorpayPaymentId(UUID.randomUUID().toString());

		// Create Order details object with order object

		double totalAmount = 0;
		for(CartItem item : entity.getCartItems()) {
			totalAmount += item.getCount() * item.getItem().getPrice();
		}

		order.setTotalAmount(totalAmount);

		repo.save(order);

		for(CartItem item : entity.getCartItems()) {
			OrderDetail detail = new OrderDetail();
			detail.setOrder(order);
			detail.setItemName(item.getItem().getName());
			detail.setItemPrice(item.getItem().getPrice());
			detail.setQuantity(item.getCount());
			orderDetailRepo.save(detail);
		}

		return order; 
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
