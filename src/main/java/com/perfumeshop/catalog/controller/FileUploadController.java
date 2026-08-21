package com.perfumeshop.catalog.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    @Value("${file.upload.path:uploads}")
    private String uploadPath;

    @Value("${file.upload.max-size:5242880}")
    private long maxFileSize;  // Default 5MB in bytes

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("File upload started: " + file.getOriginalFilename());
            System.out.println("Upload path configured: " + uploadPath);

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Validate file size
            if (file.getSize() > maxFileSize) {
                long maxSizeMB = maxFileSize / (1024 * 1024);
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "File size exceeds maximum limit of " + maxSizeMB + "MB. File size: " + (file.getSize() / (1024 * 1024)) + "MB"
                ));
            }

            // Validate file type
            String originalFilename = file.getOriginalFilename();
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/jpg"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only JPEG and PNG files are allowed. Received: " + contentType));
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Create upload directory with absolute path
            File uploadDir = new File(uploadPath).getAbsoluteFile();
            System.out.println("Creating upload directory: " + uploadDir.getAbsolutePath());

            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Failed to create upload directory: " + uploadDir.getAbsolutePath()));
                }
            }

            // Save file
            File destinationFile = new File(uploadDir, newFilename);
            file.transferTo(destinationFile);

            System.out.println("File saved successfully: " + destinationFile.getAbsolutePath());

            // Return file URL (remove /api prefix since context-path adds it)
            String fileUrl = "/files/download/" + newFilename;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", newFilename);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getFileConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("maxFileSizeBytes", maxFileSize);
        config.put("maxFileSizeMB", maxFileSize / (1024 * 1024));
        return ResponseEntity.ok(config);
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String filename) {
        try {
            File uploadDir = new File(uploadPath).getAbsoluteFile();
            File file = new File(uploadDir, filename);

            if (!file.exists()) {
                System.err.println("File not found: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(file.toPath());
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                contentType = "image/jpeg";
            }

            System.out.println("Serving file: " + file.getAbsolutePath());

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(fileContent);
        } catch (IOException e) {
            System.err.println("File download error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
