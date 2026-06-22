package com.mrp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateInventoryRequest {

    @NotNull(message = "availableQuantity is required")
    @Min(value = 0, message = "availableQuantity must be >= 0")
    private Integer availableQuantity;

    public UpdateInventoryRequest() {}

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }
}
