package com.aiinterview.prep.controller;

import com.aiinterview.prep.dto.InterviewSessionDto;
import com.aiinterview.prep.dto.StartInterviewRequest;
import com.aiinterview.prep.dto.SubmitAnswerRequest;
import com.aiinterview.prep.entity.User;
import com.aiinterview.prep.service.AuthService;
import com.aiinterview.prep.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final AuthService authService;

    @Autowired
    public InterviewController(InterviewService interviewService, AuthService authService) {
        this.interviewService = interviewService;
        this.authService = authService;
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSessionDto> startInterview(@Valid @RequestBody StartInterviewRequest request) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.startInterview(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewSessionDto> getInterviewSession(@PathVariable("id") Long id) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.getInterviewSession(id, user.getId()));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<InterviewSessionDto> submitAnswer(@PathVariable("id") Long id,
                                                            @Valid @RequestBody SubmitAnswerRequest request) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.submitAnswer(id, user.getId(), request));
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<InterviewSessionDto> finishInterview(@PathVariable("id") Long id) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.finishInterview(id, user.getId()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSessionDto>> getInterviewHistory() {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.getInterviewHistory(user.getId()));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<InterviewSessionDto> getInterviewReport(@PathVariable("id") Long id) {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(interviewService.getInterviewSession(id, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInterviewSession(@PathVariable("id") Long id) {
        User user = authService.getAuthenticatedUser();
        interviewService.deleteSession(id, user.getId());
        return ResponseEntity.ok().body("Interview session deleted successfully");
    }
}
