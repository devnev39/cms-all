package com.cms.cms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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
import com.cms.cms.models.common.Roles;
import com.cms.cms.models.dto.Order.CartDTO;
import com.cms.cms.models.dto.Order.NewOrderDTO;
import com.cms.cms.models.dto.Order.OrderDTO;
import com.cms.cms.models.entity.Order;
import com.cms.cms.repository.OrderRepository;
import com.cms.cms.service.CatererService;
import com.cms.cms.service.OrderService;
import com.cms.cms.service.RazorpayService;
import com.cms.cms.utils.CurrentUser;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = { "*" })
@AllArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final CatererService catererService;
	private OrderRepository orderRepository;
	private RazorpayService razorpayService;

	@GetMapping("")
	public List<Order> getAllOrders() {
		if (CurrentUser.hasRole(Roles.ROLE_CSTMR)) {
			return orderService.getOrdersByCustomerId(CurrentUser.getCurrentUserId());
		} else if (CurrentUser.hasRole(Roles.ROLE_CLNT)) {	
			return orderService.getOrdersByCatererId(catererService.getCatererByClientId(CurrentUser.getCurrentUserId()).getId());
		}
		return List.of();
	}

	@GetMapping("/{id}")
	public Order getOrderById(@PathVariable Long id) {
		return orderService.getOrderById(id);
	}

	// @PostMapping("")
	// public Order createOrder(@Valid @RequestBody NewOrderDTO order, BindingResult result) {
	// 	if(result.hasErrors()) {
	// 		throw new InvalidInputException("Order", result);
	// 	}
	// 	return orderService.createOrder(order);
	// }

	@PostMapping("")
	public Order createOrder(@RequestBody CartDTO entity) {
		// Create order object
		// Create Order details object with order object
		return orderService.createOrder(entity);
	}

	// @PostMapping("/coupon")
	// public Order createOrderCoupon(@RequestBody CartDTO entity) {
		
	// 	return entity;
	// }
	
	

	@PatchMapping("/{id}")
	public Order updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
		return orderService.updateOrder(id, dto);
	}

	@DeleteMapping("/{id}")
	public OperationResponse deleteOrder(@PathVariable Long id) {
		return orderService.deleteOrder(id);
	}
	
	@PostMapping("/create-payment")
	public ResponseEntity<?> createOrderAndPayment(@RequestBody CartDTO cartDto) {
	    try {
	        // Step 1: Create internal order using existing service logic
	        Order savedOrder = orderService.createOrder(cartDto);

	        // Step 2: Caterer keys (for now hardcode test keys; later store in Caterer entity)
	        String key = "rzp_test_9BkfV69LZmboMX";
	        String secret = "6jbzmrsRLOSHSud7O8QLoR9O";

	        // Step 3: Create Razorpay order
	        Long amountPaise = Math.round(savedOrder.getTotalAmount() * 100);
	        String receipt = "order_rcpt_" + savedOrder.getId();
	        com.razorpay.Order razorOrder = razorpayService.createRazorpayOrder(key, secret, amountPaise, receipt);

	        // Step 4: Save razorpay order ID to DB
	        savedOrder.setRazorpayOrderId(razorOrder.get("id"));
	        orderRepository.save(savedOrder);

	        // Step 5: Return details to frontend
	        return ResponseEntity.ok(Map.of(
	            "orderId", savedOrder.getId(),
	            "razorpayOrderId", razorOrder.get("id"),
	            "amount", amountPaise,
	            "currency", razorOrder.get("currency"),
	            "key", key
	        ));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
	    }
	}

	@PostMapping("/verify-payment")
	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
	    try {
	        Long internalOrderId = Long.valueOf(payload.get("orderId"));
	        String rPaymentId = payload.get("razorpay_payment_id");
	        String rOrderId = payload.get("razorpay_order_id");
	        String rSignature = payload.get("razorpay_signature");

	        Order order = orderRepository.findById(internalOrderId)
	                .orElseThrow(() -> new RuntimeException("Order not found"));

	        // Step 1: Verify signature
	        Map<String, String> attributes = Map.of(
	            "razorpay_payment_id", rPaymentId,
	            "razorpay_order_id", rOrderId,
	            "razorpay_signature", rSignature
	        );

	        String secret = "xxxxxxxxxxxxxxx"; // same as in create-payment
	        boolean isValid = razorpayService.verifySignature(attributes, secret);

	        if (!isValid) {
	            order.setIsValid(false);
	            orderRepository.save(order);
	            return ResponseEntity.status(400).body(Map.of("message", "Invalid signature"));
	        }

	        // Step 2: Mark order as paid
	        order.setRazorpayPaymentId(rPaymentId);
	        order.setRazorpaySignature(rSignature);
	        order.setIsValid(true);
	        orderRepository.save(order);

	        return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
	    }
	}

}
