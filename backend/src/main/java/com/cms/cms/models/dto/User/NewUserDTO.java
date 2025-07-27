package com.cms.cms.models.dto.User;

import jakarta.validation.constraints.Email;
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
public class NewUserDTO {
   @NotBlank
   private String name;

   @NotBlank
   @Email
   private String email;

   @NotBlank
   private String password;

   @NotBlank
   private String mobile;

   @NotNull
   private Long roleId;
}

