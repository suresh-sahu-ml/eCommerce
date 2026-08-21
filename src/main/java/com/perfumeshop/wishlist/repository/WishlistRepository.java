package com.perfumeshop.wishlist.repository;

import com.perfumeshop.auth.entity.User;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);

    long deleteByUserAndProduct(User user, Product product);
}
