-- ==========================================================
-- AI Interview Prep Database Schema
-- Database: MySQL 8.0+ / MariaDB 10.5+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `ai_interview_prep` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `ai_interview_prep`;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
    `target_role` VARCHAR(100) DEFAULT 'Software Engineer',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: roles
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `icon` VARCHAR(64) DEFAULT 'coffee',
    `difficulty` VARCHAR(32) DEFAULT 'Medium',
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_roles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: questions
CREATE TABLE IF NOT EXISTS `questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `role_id` BIGINT NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `question_text` TEXT NOT NULL,
    `difficulty` VARCHAR(32) NOT NULL DEFAULT 'Medium',
    `expected_topics` TEXT NULL,
    `model_answer` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_questions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    INDEX `idx_questions_role_active` (`role_id`, `active`),
    INDEX `idx_questions_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: interview_sessions
CREATE TABLE IF NOT EXISTS `interview_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    `difficulty` VARCHAR(32) NOT NULL DEFAULT 'Medium',
    `total_questions` INT NOT NULL DEFAULT 5,
    `current_question_index` INT NOT NULL DEFAULT 0,
    `overall_score` DOUBLE DEFAULT 0.0,
    `correctness_avg` DOUBLE DEFAULT 0.0,
    `relevance_avg` DOUBLE DEFAULT 0.0,
    `completeness_avg` DOUBLE DEFAULT 0.0,
    `clarity_avg` DOUBLE DEFAULT 0.0,
    `overall_recommendation` TEXT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    `started_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME NULL,
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sessions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    INDEX `idx_sessions_user_status` (`user_id`, `status`),
    INDEX `idx_sessions_started_at` (`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: responses
CREATE TABLE IF NOT EXISTS `responses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `session_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `candidate_answer` TEXT NULL,
    `time_taken_seconds` INT DEFAULT 0,
    `score` INT DEFAULT 0,
    `correctness` INT DEFAULT 0,
    `relevance` INT DEFAULT 0,
    `completeness` INT DEFAULT 0,
    `clarity` INT DEFAULT 0,
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_responses_session` FOREIGN KEY (`session_id`) REFERENCES `interview_sessions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_responses_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
    INDEX `idx_responses_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: feedback
CREATE TABLE IF NOT EXISTS `feedback` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `response_id` BIGINT NOT NULL UNIQUE,
    `strengths` TEXT NULL,
    `weaknesses` TEXT NULL,
    `feedback_text` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_feedback_response` FOREIGN KEY (`response_id`) REFERENCES `responses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
