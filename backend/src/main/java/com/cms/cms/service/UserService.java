package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.Roles;
import com.cms.cms.models.dto.User.NewUserDTO;
import com.cms.cms.models.dto.User.PasswordResetDTO;
import com.cms.cms.models.dto.User.UserDTO;
import com.cms.cms.models.entity.Role;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserService {
	private final UserRepository repo;
	private final RoleRepository roleRepo;
	private final ModelMapper mapper;

	public List<User> getAllUsers() {

		if (CurrentUser.hasRole(Roles.ROLE_ADMIN)) {
			// Return users with role ROLE_CLNT
			// Get role with ROLE_CLNT
			Role r = roleRepo.findRoleByType(Roles.ROLE_CLNT.toString())
					.orElseThrow(() -> new CustomEntityNotFoundException("Role"));
			return repo.findByRole(r);
		}
		return Collections.singletonList(getCurrentUser());
	}

	public User getCurrentUser() {
		User u = repo.findById(CurrentUser.getCurrentUserId())
				.orElseThrow(() -> new CustomEntityNotFoundException("User"));
		return u;
	}

	public User getUserById(Long id) {
		Optional<User> user = repo.findById(id);
		if (!user.isPresent())
			throw new CustomEntityNotFoundException("User");
		return user.get();
	}

	public User createUser(NewUserDTO u) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		u.setPassword(encoder.encode(u.getPassword()));
		// get the role from role_id

		Role r = roleRepo.findById(u.getRoleId()).orElseThrow(() -> new CustomEntityNotFoundException("Role"));

		User user = mapper.map(u, User.class);

		user.setRole(r);
		user.setId(null);
		// user.setCreatedBy(CurrentUser.getCurrentUser().getEmail());

		return repo.save(user);
	}

	public User updateUser(Long id, UserDTO user) {
		if (!CurrentUser.hasRole(Roles.ROLE_ADMIN) && CurrentUser.getCurrentUserId() != id)
			throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Not authorized !");
		Optional<User> u = repo.findById(id);
		if (!u.isPresent())
			throw new CustomEntityNotFoundException("User");
		else {
			User present_user = u.get();
			if (user.getName().isPresent()) {
				present_user.setName(user.getName().get());
			}
			if (user.getEmail().isPresent()) {
				present_user.setEmail(user.getEmail().get());
			}
			if (user.getMobile().isPresent()) {
				present_user.setMobile(user.getMobile().get());
			}
			if (user.getRoleId().isPresent()) {
				// present_user.setRoleId(user.getRoleId().get());
				// get the role
				// set the role
				Role role = roleRepo.findById(user.getRoleId().get())
						.orElseThrow(() -> new CustomEntityNotFoundException("Role"));
				present_user.setRole(role);
			}

			// Default updates
			present_user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
			present_user.setUpdatedBy(("#user"));
			return repo.save(present_user);
		}
	}

	public User resetPassword(PasswordResetDTO entity) {
		User u = repo.findById(entity.getId())
				.orElseThrow(() -> new CustomEntityNotFoundException("User"));
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		if (encoder.matches(entity.getOldPassword(), u.getPassword()) == false)
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
		u.setPassword(encoder.encode(entity.getNewPassword()));
		u.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
		u.setUpdatedBy(CurrentUser.getCurrentUser().getEmail());
		return repo.save(u);
	}

	public boolean deleteUser(Long id) {
		if (!CurrentUser.hasRole(Roles.ROLE_ADMIN))
			throw new HttpClientErrorException(HttpStatus.FORBIDDEN, "Not authorized !");
		repo.deleteById(id);
		return true;
	}
}
