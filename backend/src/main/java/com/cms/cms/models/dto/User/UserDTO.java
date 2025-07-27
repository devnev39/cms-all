package com.cms.cms.models.dto.User;

import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
   private Optional<String> name = Optional.empty();
   private Optional<String> email = Optional.empty();;
   private Optional<String> password = Optional.empty();
   private Optional<String> mobile = Optional.empty();
   private Optional<Long> roleId = Optional.empty(); 
}
