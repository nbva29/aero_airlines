package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ResetPasswordRequest(
        @NotBlank String resetToken,

        @NotBlank
        @Pattern(
            regexp = "^[a-zA-Z0-9]{8,}$",
            message = "Минимум 8 символов, только латинские буквы и цифры"
        )
        String password,

        @NotBlank String confirmPassword
) {}