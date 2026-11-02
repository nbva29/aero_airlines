package com.example.backend.dto;

public record AuthResponse(
    String accessToken,
    String tokenType
) {}
