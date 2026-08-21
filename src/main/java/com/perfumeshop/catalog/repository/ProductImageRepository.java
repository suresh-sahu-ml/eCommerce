package com.perfumeshop.catalog.repository;

import com.perfumeshop.catalog.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductProductIdOrderByDisplayOrder(Long productId);
    ProductImage findByProductProductIdAndIsPrimaryTrue(Long productId);
}
