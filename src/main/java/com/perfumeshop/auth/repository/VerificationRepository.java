package com.perfumeshop.auth.repository;

import com.perfumeshop.auth.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findByUserUserIdAndTypeAndIsVerifiedFalse(Long userId, String type);
    Optional<Verification> findByCodeAndUserUserId(String code, Long userId);
}
