package com.aiinterview.prep.controller;

import com.aiinterview.prep.dto.DashboardStatsDto;
import com.aiinterview.prep.entity.User;
import com.aiinterview.prep.service.AuthService;
import com.aiinterview.prep.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @Autowired
    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/student")
    public ResponseEntity<DashboardStatsDto> getStudentDashboard() {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(dashboardService.getStudentStats(user.getId()));
    }
}
