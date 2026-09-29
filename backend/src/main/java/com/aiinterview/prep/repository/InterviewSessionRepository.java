package com.aiinterview.prep.repository;

import com.aiinterview.prep.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);
    List<InterviewSession> findByUserIdAndStatusOrderByStartedAtDesc(Long userId, String status);
    List<InterviewSession> findAllByOrderByStartedAtDesc();

    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, String status);

    @Query("SELECT AVG(s.overallScore) FROM InterviewSession s WHERE s.user.id = :userId AND s.status = 'COMPLETED'")
    Double findAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT MAX(s.overallScore) FROM InterviewSession s WHERE s.user.id = :userId AND s.status = 'COMPLETED'")
    Double findMaxScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(s.overallScore) FROM InterviewSession s WHERE s.status = 'COMPLETED'")
    Double findPlatformAverageScore();
}
