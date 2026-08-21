package com.perfumeshop.auth.repository;

import com.perfumeshop.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCiamObjectId(String ciamObjectId);
    Optional<User> findByEmail(String email);
}
