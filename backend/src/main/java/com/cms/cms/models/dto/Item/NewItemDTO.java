package com.cms.cms.models.dto.Item;

import org.springframework.web.multipart.MultipartFile;

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
public class NewItemDTO {
	@NotBlank(message = "Name must not be blank")
    private String name;

    @NotNull(message = "Price must not be null")
    private Double price;

    @NotNull(message = "Caterer ID must not be null")
    private Long catererId;

    private Boolean isAvailable = true;

    private MultipartFile file;

    private String imageUri;

    private String imagePath;
}
