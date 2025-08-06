package com.cms.cms.models.dto.CouponType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NewCouponTypeDTO {
	@NotBlank
	private String type;

	@NotNull
	private Integer minCount;

	@NotNull
	private Double originalPrice;

	@NotNull
	private Double discountPerCoupon;

	@NotNull
	private Long catererId;
}
