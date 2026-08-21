package com.perfumeshop.auth.repository;

import com.perfumeshop.auth.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByTokenAndIsUsedFalse(String token);
    Optional<PasswordReset> findByUserUserIdAndIsUsedFalse(Long userId);
}
