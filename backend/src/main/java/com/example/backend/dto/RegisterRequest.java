package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank String firstName,
    String patronymic,
    @NotBlank String lastName,
    @NotBlank @Email String email,

    @NotBlank
    @Pattern(
        regexp = "^[a-zA-Z0-9]{8,}$",
        message = "Пароль должен содержать минимум 8 символов. Разрешены только латинские буквы и цифры"
    )
    String password,

    @NotBlank String confirmPassword
) {}
