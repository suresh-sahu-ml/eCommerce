package com.perfumeshop.catalog.dto;

import java.util.ArrayList;
import java.util.List;

public class CsvUploadResponse {
    private int totalRows;
    private int successfulImports;
    private int failedImports;
    private List<String> successMessages = new ArrayList<>();
    private List<String> errorMessages = new ArrayList<>();

    public CsvUploadResponse() {
    }

    public CsvUploadResponse(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getSuccessfulImports() {
        return successfulImports;
    }

    public void setSuccessfulImports(int successfulImports) {
        this.successfulImports = successfulImports;
    }

    public int getFailedImports() {
        return failedImports;
    }

    public void setFailedImports(int failedImports) {
        this.failedImports = failedImports;
    }

    public List<String> getSuccessMessages() {
        return successMessages;
    }

    public void setSuccessMessages(List<String> successMessages) {
        this.successMessages = successMessages;
    }

    public List<String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(List<String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public void addSuccess(String message) {
        this.successMessages.add(message);
        this.successfulImports++;
    }

    public void addError(String message) {
        this.errorMessages.add(message);
        this.failedImports++;
    }
}
