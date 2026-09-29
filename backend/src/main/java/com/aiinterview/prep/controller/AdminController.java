package com.aiinterview.prep.controller;

import com.aiinterview.prep.dto.AdminStatsDto;
import com.aiinterview.prep.dto.InterviewSessionDto;
import com.aiinterview.prep.dto.QuestionDto;
import com.aiinterview.prep.dto.UserProfileDto;
import com.aiinterview.prep.entity.InterviewResponse;
import com.aiinterview.prep.entity.InterviewSession;
import com.aiinterview.prep.entity.Role;
import com.aiinterview.prep.repository.InterviewResponseRepository;
import com.aiinterview.prep.repository.InterviewSessionRepository;
import com.aiinterview.prep.repository.UserRepository;
import com.aiinterview.prep.service.DashboardService;
import com.aiinterview.prep.service.QuestionService;
import com.aiinterview.prep.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final QuestionService questionService;
    private final RoleService roleService;
    private final UserRepository userRepository;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewResponseRepository responseRepository;

    @Autowired
    public AdminController(DashboardService dashboardService,
                           QuestionService questionService,
                           RoleService roleService,
                           UserRepository userRepository,
                           InterviewSessionRepository sessionRepository,
                           InterviewResponseRepository responseRepository) {
        this.dashboardService = dashboardService;
        this.questionService = questionService;
        this.roleService = roleService;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.responseRepository = responseRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getUsers() {
        List<UserProfileDto> users = userRepository.findAll().stream()
                .map(u -> new UserProfileDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getTargetRole(), u.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDto>> getQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionDto> createQuestion(@Valid @RequestBody QuestionDto dto) {
        return ResponseEntity.ok(questionService.createQuestion(dto));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable("id") Long id, @Valid @RequestBody QuestionDto dto) {
        return ResponseEntity.ok(questionService.updateQuestion(id, dto));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable("id") Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().body("Question deleted successfully");
    }

    @PatchMapping("/questions/{id}/toggle")
    public ResponseEntity<QuestionDto> toggleQuestion(@PathVariable("id") Long id) {
        return ResponseEntity.ok(questionService.toggleActive(id));
    }

    @PostMapping("/roles")
    public ResponseEntity<Role> createRole(@Valid @RequestBody Role role) {
        return ResponseEntity.ok(roleService.createRole(role));
    }

    @PutMapping("/roles/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable("id") Long id, @Valid @RequestBody Role role) {
        return ResponseEntity.ok(roleService.updateRole(id, role));
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable("id") Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok().body("Role deleted successfully");
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewSessionDto>> getAllInterviews() {
        List<InterviewSession> sessions = sessionRepository.findAllByOrderByStartedAtDesc();
        List<InterviewSessionDto> dtos = sessions.stream().map(s -> {
            List<InterviewResponse> resps = responseRepository.findBySessionIdOrderByIdAsc(s.getId());
            return new InterviewSessionDto(s, resps);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
