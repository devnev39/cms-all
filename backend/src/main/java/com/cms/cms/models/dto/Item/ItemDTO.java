package com.cms.cms.models.dto.Item;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
    private Optional<String> name = Optional.empty();
    private Optional<Double> price = Optional.empty(); 
    private Optional<MultipartFile> file = Optional.empty();
    private Optional<Boolean> isAvailable = Optional.empty();
    private Optional<String> imageUri = Optional.empty();
    private Optional<String> imagePath = Optional.empty();
}
