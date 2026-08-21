package com.perfumeshop.catalog.controller;

import com.perfumeshop.catalog.dto.CsvUploadResponse;
import com.perfumeshop.catalog.service.ProductCsvService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/products/csv")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductCsvController {

    private static final Logger logger = LoggerFactory.getLogger(ProductCsvController.class);

    @Autowired
    private ProductCsvService productCsvService;

    @GetMapping("/template")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> downloadTemplate() {
        try {
            String csvContent = productCsvService.generateCsvTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Disposition", "attachment; filename=product_template.csv");
            headers.set("Content-Type", "text/csv");
            return new ResponseEntity<>(csvContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error generating CSV template", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Failed to generate template: " + e.getMessage()));
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProducts(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "File is empty"));
            }

            if (!file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "File must be a CSV file"));
            }

            logger.info("Processing CSV upload: {}", file.getOriginalFilename());
            CsvUploadResponse response = productCsvService.importProductsFromCsv(file);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error uploading CSV", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Failed to process CSV: " + e.getMessage()));
        }
    }
}
