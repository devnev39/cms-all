package com.cms.cms.models.dto;

import java.util.Optional;

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
}
