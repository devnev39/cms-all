package com.cms.cms.models.dto;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CatererDTO {
    private Optional<String> name = Optional.empty();
    private Optional<Long> userId = Optional.empty();
}
