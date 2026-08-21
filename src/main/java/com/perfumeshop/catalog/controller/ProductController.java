package com.perfumeshop.catalog.controller;

import com.perfumeshop.catalog.dto.ProductRequest;
import com.perfumeshop.catalog.dto.ProductResponse;
import com.perfumeshop.catalog.dto.ProductSizeDto;
import com.perfumeshop.catalog.dto.DiscountUpdateRequest;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.entity.ProductImage;
import com.perfumeshop.catalog.entity.ProductSize;
import com.perfumeshop.catalog.repository.ProductRepository;
import com.perfumeshop.catalog.repository.ProductImageRepository;
import com.perfumeshop.catalog.repository.ProductSizeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productRepository.findAll(PageRequest.of(page, size));
        List<ProductResponse> responses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(responses, products.getPageable(), products.getTotalElements()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<ProductResponse>> getActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        // Ensure images are loaded for each product
        List<ProductResponse> responses = products.stream()
                .map(product -> {
                    // Force load images
                    product.getImages().size();
                    return convertToResponse(product);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(convertToResponse(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductResponse> getProductBySku(@PathVariable String sku) {
        return productRepository.findBySku(sku)
                .map(product -> ResponseEntity.ok(convertToResponse(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoints
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        try {
            System.out.println("CREATE - Received isActive: " + request.isActive());
            Product product = new Product();
            product.setProductName(request.getProductName());
            product.setSku(request.getSku());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setStockQuantity(request.getStockQuantity());
            product.setBrand(request.getBrand());
            product.setVolumeMl(request.getVolumeMl());
            product.setOlfactiveFamily(request.getOlfactiveFamily());
            product.setActive(request.isActive());
            System.out.println("CREATE - After setActive, product.isActive(): " + product.isActive());

            Product savedProduct = productRepository.save(product);

            // Save images
            if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                for (int i = 0; i < request.getImageUrls().size(); i++) {
                    ProductImage image = new ProductImage(
                            request.getImageUrls().get(i),
                            i,
                            i == 0
                    );
                    image.setProduct(savedProduct);
                    productImageRepository.save(image);
                }
            }

            // Save sizes (max 4)
            if (request.getSizes() != null && !request.getSizes().isEmpty()) {
                int sizeCount = Math.min(request.getSizes().size(), 4);
                for (int i = 0; i < sizeCount; i++) {
                    ProductSizeDto sizeDto = request.getSizes().get(i);
                    ProductSize size = new ProductSize(
                            sizeDto.getSizeName(),
                            sizeDto.getSizeValue(),
                            sizeDto.getPrice(),
                            i
                    );
                    size.setProduct(savedProduct);
                    productSizeRepository.save(size);
                }
            }

            // Refresh product to load images and sizes
            savedProduct = productRepository.findById(savedProduct.getProductId()).orElse(savedProduct);

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponse(savedProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        System.out.println("UPDATE - Received isActive: " + request.isActive());
        return productRepository.findById(id)
                .map(product -> {
                    product.setProductName(request.getProductName());
                    product.setSku(request.getSku());
                    product.setDescription(request.getDescription());
                    product.setPrice(request.getPrice());
                    product.setStockQuantity(request.getStockQuantity());
                    product.setBrand(request.getBrand());
                    product.setVolumeMl(request.getVolumeMl());
                    product.setOlfactiveFamily(request.getOlfactiveFamily());
                    product.setActive(request.isActive());
                    System.out.println("UPDATE - After setActive, product.isActive(): " + product.isActive());

                    // Update images
                    if (request.getImageUrls() != null) {
                        product.getImages().clear();
                        for (int i = 0; i < request.getImageUrls().size(); i++) {
                            ProductImage image = new ProductImage(
                                    request.getImageUrls().get(i),
                                    i,
                                    i == 0
                            );
                            image.setProduct(product);
                            product.getImages().add(image);
                        }
                    }

                    // Update sizes (max 4)
                    if (request.getSizes() != null) {
                        product.getSizes().clear();
                        int sizeCount = Math.min(request.getSizes().size(), 4);
                        for (int i = 0; i < sizeCount; i++) {
                            ProductSizeDto sizeDto = request.getSizes().get(i);
                            ProductSize size = new ProductSize(
                                    sizeDto.getSizeName(),
                                    sizeDto.getSizeValue(),
                                    sizeDto.getPrice(),
                                    i
                            );
                            size.setProduct(product);
                            product.getSizes().add(size);
                        }
                    }

                    Product updatedProduct = productRepository.save(product);
                    // Refresh product to load images and sizes
                    updatedProduct = productRepository.findById(updatedProduct.getProductId()).orElse(updatedProduct);
                    return ResponseEntity.ok(convertToResponse(updatedProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/discount")
    public ResponseEntity<ProductResponse> updateProductDiscount(
            @PathVariable Long id,
            @RequestBody DiscountUpdateRequest request) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setDiscountType(request.getDiscountType());
                    product.setDiscountValue(request.getDiscountValue());
                    product.setDiscountActive(request.isDiscountActive());
                    Product updatedProduct = productRepository.save(product);
                    return ResponseEntity.ok(convertToResponse(updatedProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/discount")
    public ResponseEntity<ProductResponse> deleteProductDiscount(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setDiscountType(null);
                    product.setDiscountValue(BigDecimal.ZERO);
                    product.setDiscountActive(false);
                    Product updatedProduct = productRepository.save(product);
                    return ResponseEntity.ok(convertToResponse(updatedProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private ProductResponse convertToResponse(Product product) {
        var notes = product.getPerfumeNotes().stream()
                .map(note -> note.getNoteName())
                .collect(Collectors.toSet());
        ProductResponse response = new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getSku(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getBrand(),
                product.getVolumeMl(),
                notes
        );
        var imageUrls = product.getImages().stream()
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
        response.setImageUrls(imageUrls);

        var sizes = product.getSizes().stream()
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .map(ps -> {
                    ProductSizeDto dto = new ProductSizeDto();
                    dto.setSizeId(ps.getSizeId());
                    dto.setSizeName(ps.getSizeName());
                    dto.setSizeValue(ps.getSizeValue());
                    dto.setPrice(ps.getPrice());
                    dto.setDisplayOrder(ps.getDisplayOrder());
                    return dto;
                })
                .collect(Collectors.toList());
        response.setSizes(sizes);
        response.setOlfactiveFamily(product.getOlfactiveFamily());

        response.setIsActive(product.isActive());
        response.setDiscountType(product.getDiscountType());
        response.setDiscountValue(product.getDiscountValue());
        response.setIsDiscountActive(product.isDiscountActive());
        response.setDiscountedPrice(product.getDiscountedPrice());
        response.setCreatedDate(product.getCreatedDate());
        response.setLastModifiedDate(product.getLastModifiedDate());
        return response;
    }
}
