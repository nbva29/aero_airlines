package com.example.backend.service;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.*;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Пароли не совпадают"
            );
        }

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email уже зарегистрирован"
            );
        }

        User user = new User();

        user.setFirstName(request.firstName());
        user.setPatronymic(request.patronymic());
        user.setLastName(request.lastName());
        user.setEmail(email);
        user.setPassword(
            passwordEncoder.encode(request.password())
        );
        user.setRegistrationDate(LocalDate.now());

        User savedUser = userRepository.saveAndFlush(user);

        return new AuthResponse(
            jwtService.generateToken(savedUser),
            "Bearer"
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Неверная почта или пароль"
                ));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Неверная почта или пароль"
            );
        }

        return new AuthResponse(
            jwtService.generateToken(user),
            "Bearer"
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Пользователь не найден"
                ));

        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail()
        );
    }
}