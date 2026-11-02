
package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.PasswordResetService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService
    ) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        passwordResetService.sendCode(request.email());

        return ResponseEntity.ok(
                new MessageResponse(
                    "Если почта зарегистрирована, код будет отправлен"
                )
        );
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<VerifyResetCodeResponse> verifyCode(
            @Valid @RequestBody VerifyResetCodeRequest request
    ) {
        return ResponseEntity.ok(
                passwordResetService.verifyCode(
                        request.email(),
                        request.code()
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        passwordResetService.resetPassword(request);

        return ResponseEntity.ok(
                new MessageResponse("Пароль успешно изменён")
        );
    }
}
