
package com.example.backend.service;

import com.example.backend.dto.ResetPasswordRequest;
import com.example.backend.dto.VerifyResetCodeResponse;
import com.example.backend.entity.PasswordReset;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordResetRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class PasswordResetService {

    private static final int MAX_ATTEMPTS = 5;

    private final UserRepository userRepository;
    private final PasswordResetRepository resetRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetRepository resetRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.resetRepository = resetRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void sendCode(String email) {
        String normalizedEmail = email.trim();

        User user = userRepository
                .findByEmail(normalizedEmail)
                .orElse(null);

        if (user == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        PasswordReset reset = resetRepository
                .findByUserIdForUpdate(user.getId())
                .orElseGet(PasswordReset::new);

        if (reset.getId() != null
                && reset.getCreatedAt().plusSeconds(60).isAfter(now)) {
            return;
        }

        String code = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        reset.setUserId(user.getId());
        reset.setCodeHash(passwordEncoder.encode(code));
        reset.setCreatedAt(now);
        reset.setExpiresAt(now.plusMinutes(5));
        reset.setAttempts(0);

        reset.setResetTokenHash(null);
        reset.setTokenExpiresAt(null);

        resetRepository.saveAndFlush(reset);

        emailService.sendPasswordResetCode(
                user.getEmail(),
                code
        );
    }

    @Transactional
    public VerifyResetCodeResponse verifyCode(
            String email,
            String code
    ) {
        User user = userRepository
                .findByEmail(email.trim())
                .orElseThrow(this::invalidCode);

        PasswordReset reset = resetRepository
                .findByUserIdForUpdate(user.getId())
                .orElseThrow(this::invalidCode);

        LocalDateTime now = LocalDateTime.now();

        if (reset.getExpiresAt().isBefore(now)
                || reset.getAttempts() >= MAX_ATTEMPTS) {
            throw invalidCode();
        }

        if (!passwordEncoder.matches(code, reset.getCodeHash())) {
            reset.setAttempts(reset.getAttempts() + 1);
            resetRepository.saveAndFlush(reset);
            return invalidCodeResponse();
        }

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        reset.setResetTokenHash(sha256(token));
        reset.setTokenExpiresAt(now.plusMinutes(10));

        reset.setCodeHash(passwordEncoder.encode(token));
        reset.setExpiresAt(now);

        resetRepository.save(reset);

        return new VerifyResetCodeResponse(token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Пароли не совпадают"
            );
        }

        String tokenHash = sha256(request.resetToken());

        PasswordReset reset = resetRepository
                .findByResetTokenHashForUpdate(tokenHash)
                .orElseThrow(this::invalidToken);

        if (reset.getTokenExpiresAt() == null
                || !reset.getTokenExpiresAt().isAfter(LocalDateTime.now())) {
            throw invalidToken();
        }

        User user = userRepository
                .findById(reset.getUserId())
                .orElseThrow(this::invalidToken);

        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        userRepository.save(user);

        resetRepository.delete(reset);
    }

    private String sha256(String value) {
        try {
            byte[] hash = MessageDigest
                    .getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 недоступен", e
            );
        }
    }

    private ResponseStatusException invalidCode() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Неверный или просроченный код"
        );
    }

    private ResponseStatusException invalidToken() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Недействительный или просроченный токен"
        );
    }

    private VerifyResetCodeResponse invalidCodeResponse() {
        throw invalidCode();
    }
}
