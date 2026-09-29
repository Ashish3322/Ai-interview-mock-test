package com.aiinterview.prep.repository;

import com.aiinterview.prep.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByRoleIdAndActiveTrue(Long roleId);
    List<Question> findByRoleId(Long roleId);
    List<Question> findByRoleIdAndDifficultyAndActiveTrue(Long roleId, String difficulty);

    @Query("SELECT q FROM Question q WHERE q.role.id = :roleId AND q.active = true ORDER BY function('RAND')")
    List<Question> findRandomQuestionsByRole(@Param("roleId") Long roleId);

    @Query("SELECT q FROM Question q WHERE q.role.id = :roleId AND q.difficulty = :difficulty AND q.active = true ORDER BY function('RAND')")
    List<Question> findRandomQuestionsByRoleAndDifficulty(@Param("roleId") Long roleId, @Param("difficulty") String difficulty);
}
