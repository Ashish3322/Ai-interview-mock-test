package com.aiinterview.prep.controller;

import com.aiinterview.prep.dto.*;
import com.aiinterview.prep.entity.User;
import com.aiinterview.prep.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMe() {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(authService.getProfile(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(authService.updateProfile(user.getId(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = authService.getAuthenticatedUser();
        authService.changePassword(user.getId(), request);
        return ResponseEntity.ok().body("Password changed successfully");
    }
}
