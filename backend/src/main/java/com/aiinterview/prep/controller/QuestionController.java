package com.aiinterview.prep.controller;

import com.aiinterview.prep.dto.QuestionDto;
import com.aiinterview.prep.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByRole(@PathVariable("roleId") Long roleId) {
        return ResponseEntity.ok(questionService.getQuestionsByRole(roleId));
    }

    @GetMapping("/public/role/{roleId}")
    public ResponseEntity<List<QuestionDto>> getPublicQuestionsByRole(@PathVariable("roleId") Long roleId) {
        return ResponseEntity.ok(questionService.getQuestionsByRole(roleId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }
}
