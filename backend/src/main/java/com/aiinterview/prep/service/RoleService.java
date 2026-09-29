package com.aiinterview.prep.service;

import com.aiinterview.prep.entity.Role;
import com.aiinterview.prep.exception.BadRequestException;
import com.aiinterview.prep.exception.ResourceNotFoundException;
import com.aiinterview.prep.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles(boolean activeOnly) {
        if (activeOnly) {
            return roleRepository.findByActiveTrue();
        }
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    public Role getRoleBySlug(String slug) {
        return roleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with slug: " + slug));
    }

    @Transactional
    public Role createRole(Role role) {
        if (roleRepository.existsByName(role.getName())) {
            throw new BadRequestException("Role name already exists");
        }
        if (role.getSlug() == null || role.getSlug().isBlank()) {
            role.setSlug(role.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        if (roleRepository.existsBySlug(role.getSlug())) {
            throw new BadRequestException("Role slug already exists");
        }
        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRole(Long id, Role updated) {
        Role role = getRoleById(id);
        role.setName(updated.getName());
        role.setDescription(updated.getDescription());
        role.setIcon(updated.getIcon());
        role.setDifficulty(updated.getDifficulty());
        if (updated.getActive() != null) {
            role.setActive(updated.getActive());
        }
        return roleRepository.save(role);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }
}
