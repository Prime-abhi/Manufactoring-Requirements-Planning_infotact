package com.mrp.service;

import com.mrp.entity.User;
import com.mrp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Validate credentials. Returns the user if valid, empty otherwise.
     * NOTE: Plain-text password check — replace with BCrypt in production.
     */
    public Optional<User> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
            .filter(u -> u.getPassword().equals(password));
    }
}
