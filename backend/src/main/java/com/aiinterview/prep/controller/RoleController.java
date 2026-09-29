package com.aiinterview.prep.controller;

import com.aiinterview.prep.entity.Role;
import com.aiinterview.prep.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles(@RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly) {
        return ResponseEntity.ok(roleService.getAllRoles(activeOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }
}
