package com.cms.cms.models.dto.Order;

import com.cms.cms.models.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewOrderDTO {
	
	@NotNull(message = "User must not be null")
    private User userId;

    @Positive(message = "Total amount must be positive")
    private double totalAmount;

    @NotBlank(message = "Razorpay Payment ID cannot be blank")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay Order ID cannot be blank")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay Signature cannot be blank")
    private String razorpaySignature;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

}
