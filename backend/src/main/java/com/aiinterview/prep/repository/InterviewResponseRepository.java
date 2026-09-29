package com.aiinterview.prep.repository;

import com.aiinterview.prep.entity.InterviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewResponseRepository extends JpaRepository<InterviewResponse, Long> {
    List<InterviewResponse> findBySessionIdOrderByIdAsc(Long sessionId);
    Optional<InterviewResponse> findBySessionIdAndQuestionId(Long sessionId, Long questionId);
}
