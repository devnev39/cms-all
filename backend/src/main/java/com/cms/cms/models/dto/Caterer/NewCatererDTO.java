package com.cms.cms.models.dto.Caterer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewCatererDTO {
    @NotBlank
    private String name; 

    @NotNull
    private Long userId;

    @NotBlank
    private String razorpay_key;

    @NotBlank
    private String razorpay_secret;
}
