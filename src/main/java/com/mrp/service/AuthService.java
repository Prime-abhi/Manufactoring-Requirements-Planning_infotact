package com.mrp.service;

import com.mrp.entity.User;
import com.mrp.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final UserRepository userRepository;

	public AuthService(UserRepository userRepository) {
	    this.userRepository = userRepository;
	}

    public User login(String email, String password) {

        // Find user by email
        User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException(
                    "Invalid email or password"));

        // Check password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException(
                "Invalid email or password");
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException(
                    "User not found"));
    }
}