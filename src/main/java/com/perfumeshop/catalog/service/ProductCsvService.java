package com.perfumeshop.catalog.service;

import com.perfumeshop.catalog.dto.CsvProductRequest;
import com.perfumeshop.catalog.dto.CsvUploadResponse;
import com.perfumeshop.catalog.entity.Product;
import com.perfumeshop.catalog.entity.ProductImage;
import com.perfumeshop.catalog.repository.ProductRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductCsvService {

    private static final Logger logger = LoggerFactory.getLogger(ProductCsvService.class);

    @Autowired
    private ProductRepository productRepository;

    public String generateCsvTemplate() {
        StringBuilder csv = new StringBuilder();
        csv.append("productName,sku,brand,description,price,volumeMl,olfactiveFamily,stockQuantity,isActive,discountType,discountValue,isDiscountActive,imageUrl,additionalImages\n");
        csv.append("Example Perfume,EX001,CHANEL,A beautiful floral fragrance,8500.00,100,Floral,50,true,PERCENTAGE,10,true,https://example.com/image1.jpg,https://example.com/image2.jpg;https://example.com/image3.jpg\n");
        return csv.toString();
    }

    @Transactional
    public CsvUploadResponse importProductsFromCsv(MultipartFile file) {
        CsvUploadResponse response = new CsvUploadResponse();
        int rowNumber = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {

            for (CSVRecord csvRecord : csvParser) {
                rowNumber++;
                try {
                    Product product = createProductFromCsvRecord(csvRecord, rowNumber);
                    Product savedProduct = productRepository.save(product);
                    response.addSuccess("Row " + rowNumber + ": Successfully imported " + product.getProductName() + " (SKU: " + product.getSku() + ")");
                    logger.info("Imported product: {} with SKU: {}", product.getProductName(), product.getSku());
                } catch (Exception e) {
                    String errorMsg = "Row " + rowNumber + ": " + e.getMessage();
                    response.addError(errorMsg);
                    logger.error("Error importing row {}: {}", rowNumber, e.getMessage());
                }
            }

            response.setTotalRows(rowNumber);

        } catch (Exception e) {
            logger.error("Error parsing CSV file", e);
            response.addError("Failed to parse CSV file: " + e.getMessage());
        }

        return response;
    }

    private Product createProductFromCsvRecord(CSVRecord record, int rowNumber) throws Exception {
        // Required fields
        String productName = getStringField(record, "productName");
        if (productName == null || productName.trim().isEmpty()) {
            throw new IllegalArgumentException("productName is required");
        }

        String sku = getStringField(record, "sku");
        if (sku == null || sku.trim().isEmpty()) {
            throw new IllegalArgumentException("sku is required");
        }

        // Check if SKU already exists
        if (productRepository.findBySku(sku).isPresent()) {
            throw new IllegalArgumentException("SKU already exists: " + sku);
        }

        BigDecimal price = getBigDecimalField(record, "price");
        if (price == null) {
            throw new IllegalArgumentException("price is required");
        }

        Integer stockQuantity = getIntegerField(record, "stockQuantity");
        if (stockQuantity == null) {
            throw new IllegalArgumentException("stockQuantity is required");
        }

        // Create product
        Product product = new Product(productName, sku, price, stockQuantity);

        // Optional fields
        product.setBrand(getStringField(record, "brand"));
        product.setDescription(getStringField(record, "description"));
        product.setVolumeMl(getIntegerField(record, "volumeMl"));
        product.setOlfactiveFamily(getStringField(record, "olfactiveFamily"));

        Boolean isActive = getBooleanField(record, "isActive");
        product.setActive(isActive != null ? isActive : true);

        // Discount fields
        product.setDiscountType(getStringField(record, "discountType"));
        product.setDiscountValue(getBigDecimalField(record, "discountValue"));
        Boolean isDiscountActive = getBooleanField(record, "isDiscountActive");
        product.setDiscountActive(isDiscountActive != null ? isDiscountActive : false);

        // Handle images
        String imageUrl = getStringField(record, "imageUrl");
        String additionalImages = getStringField(record, "additionalImages");

        Set<ProductImage> images = new HashSet<>();
        int displayOrder = 0;

        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            ProductImage primaryImage = new ProductImage();
            primaryImage.setImageUrl(imageUrl.trim());
            primaryImage.setDisplayOrder(displayOrder++);
            primaryImage.setProduct(product);
            images.add(primaryImage);
        }

        if (additionalImages != null && !additionalImages.trim().isEmpty()) {
            String[] urls = additionalImages.split(";");
            for (String url : urls) {
                url = url.trim();
                if (!url.isEmpty()) {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(url);
                    image.setDisplayOrder(displayOrder++);
                    image.setProduct(product);
                    images.add(image);
                }
            }
        }

        if (!images.isEmpty()) {
            product.setImages(images);
        }

        return product;
    }

    private String getStringField(CSVRecord record, String fieldName) {
        try {
            String value = record.get(fieldName);
            return (value == null || value.trim().isEmpty()) ? null : value.trim();
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private BigDecimal getBigDecimalField(CSVRecord record, String fieldName) {
        try {
            String value = getStringField(record, fieldName);
            return (value == null) ? null : new BigDecimal(value);
        } catch (Exception e) {
            return null;
        }
    }

    private Integer getIntegerField(CSVRecord record, String fieldName) {
        try {
            String value = getStringField(record, fieldName);
            return (value == null) ? null : Integer.parseInt(value);
        } catch (Exception e) {
            return null;
        }
    }

    private Boolean getBooleanField(CSVRecord record, String fieldName) {
        try {
            String value = getStringField(record, fieldName);
            if (value == null) return null;
            return value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes") || value.equalsIgnoreCase("1");
        } catch (Exception e) {
            return null;
        }
    }
}
