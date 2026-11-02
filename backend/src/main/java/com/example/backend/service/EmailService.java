
package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String from
    ) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendPasswordResetCode(
            String email,
            String code
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(email);
        message.setSubject("AERO — восстановление пароля");

        message.setText(
            "Ваш код для восстановления пароля: " + code
            + "\n\nКод действует 5 минут."
            + "\nЕсли вы не запрашивали восстановление,"
            + " просто проигнорируйте письмо."
        );

        mailSender.send(message);
    }
}
