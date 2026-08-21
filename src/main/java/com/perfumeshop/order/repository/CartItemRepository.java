package com.perfumeshop.order.repository;

import com.perfumeshop.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartCartIdAndProductProductIdAndProductSizeSizeId(Long cartId, Long productId, Long sizeId);
}
