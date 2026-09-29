package com.aiinterview.prep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Target role cannot be empty")
    private String targetRole;

    public UpdateProfileRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}
