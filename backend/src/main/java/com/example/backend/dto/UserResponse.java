package com.example.backend.dto;

public record UserResponse(
    Integer id,
    String firstName,
    String lastName,
    String email
) {}