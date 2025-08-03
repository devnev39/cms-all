package com.cms.cms.models.dto.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PasswordResetDTO {
    @NotNull
    private Long id;

    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;
}
