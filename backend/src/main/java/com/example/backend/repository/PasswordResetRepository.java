
package com.example.backend.repository;

import com.example.backend.entity.PasswordReset;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PasswordResetRepository
        extends JpaRepository<PasswordReset, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM PasswordReset r WHERE r.userId = :userId")
    Optional<PasswordReset> findByUserIdForUpdate(
            @Param("userId") Integer userId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM PasswordReset r WHERE r.resetTokenHash = :hash")
    Optional<PasswordReset> findByResetTokenHashForUpdate(
            @Param("hash") String hash
    );
}
