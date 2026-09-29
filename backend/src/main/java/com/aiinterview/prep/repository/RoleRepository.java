package com.aiinterview.prep.repository;

import com.aiinterview.prep.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findBySlug(String slug);
    List<Role> findByActiveTrue();
    boolean existsBySlug(String slug);
    boolean existsByName(String name);
}
