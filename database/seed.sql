-- ==========================================================
-- AI Interview Prep Seed Data
-- ==========================================================

USE `ai_interview_prep`;

-- 1. Insert Default Users (Password for admin: admin123, for student: student123)
-- BCrypt hashes:
-- admin123: $2a$10$w8gZ49vKxZ0J.uT2C/iLpOX0hM6yZ02gMekgQ12Y1j/fQ9g0EsmBq
-- student123: $2a$10$T1KqL21g9QW5zMek199K.ODL8C2eD5zZgP97K8K4vQ9g0EsmBq
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `target_role`, `created_at`)
VALUES
(1, 'Admin Manager', 'admin@aiinterview.com', '$2a$10$k1wK.8j1W1q2Y3Z4A5B6CeD7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S', 'ROLE_ADMIN', 'Platform Architect', NOW()),
(2, 'Ashish Kumar', 'student@aiinterview.com', '$2a$10$k1wK.8j1W1q2Y3Z4A5B6CeD7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S', 'ROLE_STUDENT', 'Java Developer', NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Insert Supported Roles
INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `icon`, `difficulty`, `active`, `created_at`)
VALUES
(1, 'Java Developer', 'java-developer', 'Core Java, OOPs, Collections, Multithreading, Spring Boot, Microservices & JVM performance tuning.', 'coffee', 'Medium', TRUE, NOW()),
(2, 'Frontend Developer', 'frontend-developer', 'React, TypeScript, CSS architecture, DOM manipulation, state management & web performance.', 'layout', 'Medium', TRUE, NOW()),
(3, 'Backend Developer', 'backend-developer', 'Distributed systems, REST APIs, databases, caching, concurrency & system design.', 'server', 'Hard', TRUE, NOW()),
(4, 'Full Stack Developer', 'fullstack-developer', 'End-to-end web applications, modern UI frameworks, backend microservices, DBs & deployment.', 'layers', 'Hard', TRUE, NOW()),
(5, 'Python Developer', 'python-developer', 'Python internals, OOP, Django/FastAPI, data manipulation, generators & asyncio.', 'code', 'Medium', TRUE, NOW()),
(6, 'Data Analyst', 'data-analyst', 'SQL query optimization, data cleaning, statistical modeling, Pandas & dashboard insights.', 'bar-chart', 'Medium', TRUE, NOW()),
(7, 'Software Engineer', 'software-engineer', 'Data structures, algorithms, object-oriented design, problem solving & clean code practices.', 'cpu', 'Medium', TRUE, NOW()),
(8, 'HR / Behavioral', 'hr-behavioral', 'STAR technique, leadership principles, conflict resolution, situational judgment & career goals.', 'users', 'Easy', TRUE, NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. Insert Comprehensive Questions
INSERT INTO `questions` (`role_id`, `category`, `question_text`, `difficulty`, `expected_topics`, `model_answer`, `active`, `created_at`)
VALUES
-- Java Developer
(1, 'Technical', 'Explain the difference between HashMap and Hashtable in Java.', 'Medium', 'thread safety, synchronized, null keys, performance, fail-fast iterator', 'HashMap is non-synchronized, allows one null key and multiple null values, and is faster. Hashtable is legacy, synchronized, thread-safe, and does not allow null keys or values.', TRUE, NOW()),
(1, 'Technical', 'How does Garbage Collection work in Java and what are generational GC concepts?', 'Hard', 'JVM, Eden, Survivor spaces, Tenured, Stop-the-world, G1, Mark and Sweep', 'Java GC manages heap memory automatically using generational hypothesis: Young Generation (Eden + Survivor spaces) for short-lived objects, and Old Generation for long-lived objects.', TRUE, NOW()),
(1, 'Coding', 'What is the contract between equals() and hashCode() in Java?', 'Medium', 'hashCode, equals, consistency, HashMap buckets, collision', 'If two objects are equal according to equals(), they must produce the same integer hashCode. If two objects have the same hashCode, they are not necessarily equal.', TRUE, NOW()),
(1, 'Database', 'What is Spring Data JPA and how does dirty checking work?', 'Medium', 'Hibernate, EntityManager, Persistence Context, transaction commit, flush', 'Spring Data JPA abstracts Hibernate persistence. During a transaction, entities loaded into persistence context are snapshot; upon commit, dirty checking compares snapshots and issues SQL updates automatically.', TRUE, NOW()),

-- Frontend Developer
(2, 'Technical', 'Explain the Virtual DOM in React and how the reconciliation algorithm works.', 'Medium', 'Virtual DOM, diffing algorithm, fiber, reconciliation, state updates, rerendering', 'The Virtual DOM is an in-memory representation of real DOM elements. When state changes, React creates a new VDOM tree, diffs it with the previous tree (reconciliation), and batches minimal real DOM updates.', TRUE, NOW()),
(2, 'Technical', 'What is the difference between useEffect, useLayoutEffect, and useMemo?', 'Medium', 'side effects, asynchronous, DOM paint, memoization, render cycle', 'useEffect runs asynchronously after browser paint for side effects; useLayoutEffect runs synchronously immediately after DOM mutations before browser paint; useMemo memoizes computed values.', TRUE, NOW()),
(2, 'Technical', 'Explain CSS Box Model and how box-sizing: border-box alters layout calculation.', 'Easy', 'content, padding, border, margin, border-box, width calculation', 'The CSS Box Model consists of content, padding, border, and margin. Default content-box excludes padding and border from specified width, while border-box includes padding and border within the declared width.', TRUE, NOW()),
(2, 'Coding', 'What is Event Bubbling and Event Delegation in JavaScript?', 'Medium', 'event propagation, capturing, bubbling, parent listener, event target', 'Event bubbling is where an event triggers on the deepest target and propagates up through ancestor elements. Event delegation leverages bubbling by placing a single listener on a parent element.', TRUE, NOW()),

-- Backend Developer
(3, 'System Design', 'How would you design a scalable URL shortener like Bitly?', 'Hard', 'Base62 encoding, hashing, database sharding, caching, Redis, rate limiting, collision resolution', 'Key components: API gateway, URL generation service using Base62 or auto-incrementing ID with distributed unique ID generator, Redis caching layer with LRU eviction, and horizontally partitioned storage.', TRUE, NOW()),
(3, 'Database', 'Explain database indexing: B-Trees vs Hash Indexes and when to use each.', 'Medium', 'B-Tree, Hash index, range queries, exact lookups, clustered index, O(log N)', 'B-Tree indexes maintain sorted order, making them ideal for range queries, sorting, and prefix matching with O(log N) lookup. Hash indexes offer O(1) point lookups but do not support range scans.', TRUE, NOW()),
(3, 'Technical', 'What are the core differences between Monolithic and Microservices architectures?', 'Medium', 'scalability, deployment, network overhead, database per service, fault isolation', 'A monolith packages all business modules into a single deployable unit. Microservices decompose functionality into independently deployable, loosely coupled services communicating via APIs/queues.', TRUE, NOW()),

-- Full Stack Developer
(4, 'Technical', 'Explain how CORS (Cross-Origin Resource Sharing) works and how preflight requests are handled.', 'Medium', 'same-origin policy, OPTIONS request, Access-Control-Allow-Origin, headers, browser security', 'CORS is a browser security mechanism that restricts cross-origin HTTP requests. For non-simple requests, browsers send an HTTP OPTIONS preflight request before sending the actual request.', TRUE, NOW()),
(4, 'System Design', 'Describe the flow of a modern full-stack web application from DNS lookup to database query.', 'Hard', 'DNS resolution, TLS handshake, CDN, Load Balancer, Nginx reverse proxy, Backend API, ORM, Database', 'Client types URL -> DNS resolves IP -> TCP/TLS handshake -> CDN serves static assets -> API requests hit Reverse Proxy/LB -> routed to Spring Boot backend -> auth verified -> ORM queries DB -> JSON returned -> React renders UI.', TRUE, NOW()),

-- Python Developer
(5, 'Technical', 'Explain Python''s GIL (Global Interpreter Lock) and how it affects multithreading.', 'Medium', 'GIL, CPython, CPU-bound, I/O-bound, multiprocessing, thread safety', 'The Global Interpreter Lock is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It prevents true parallel execution in CPU-bound tasks, where multiprocessing is preferred.', TRUE, NOW()),
(5, 'Coding', 'What is the difference between generators and regular functions in Python?', 'Easy', 'yield, lazy evaluation, memory efficiency, iterator protocol, next()', 'Generators use the yield keyword to return values lazily one by one, preserving execution state between calls and consuming minimal memory compared to returning a full list.', TRUE, NOW()),

-- Data Analyst
(6, 'Database', 'What are SQL Window Functions and how do ROW_NUMBER(), RANK(), and DENSE_RANK() differ?', 'Medium', 'OVER clause, PARTITION BY, ORDER BY, tie handling, gap in numbering', 'Window functions perform calculations across a set of table rows related to the current row. ROW_NUMBER assigns unique sequential integers. RANK assigns same rank to ties with gaps, while DENSE_RANK assigns same rank without gaps.', TRUE, NOW()),
(6, 'Technical', 'How do you detect and handle missing data and outliers in a dataset?', 'Medium', 'imputation, mean, median, IQR method, z-score, deletion, domain context', 'Missing data can be handled via deletion or imputation. Outliers are detected using IQR (1.5 * IQR) or Z-score (> 3 standard deviations) and capped or investigated.', TRUE, NOW()),

-- Software Engineer
(7, 'Technical', 'Explain the SOLID principles of Object-Oriented Design.', 'Medium', 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion', 'SOLID encompasses: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.', TRUE, NOW()),
(7, 'Coding', 'Explain the time and space complexity of QuickSort vs MergeSort.', 'Medium', 'O(N log N), worst case O(N^2), in-place, divide and conquer, auxiliary memory', 'MergeSort has guaranteed O(N log N) time complexity and O(N) auxiliary space. QuickSort has O(N log N) average time and O(log N) space, but O(N^2) worst case when poorly pivoted.', TRUE, NOW()),

-- HR / Behavioral
(8, 'Behavioral', 'Tell me about a time you faced a difficult conflict with a team member and how you resolved it.', 'Easy', 'STAR method, Situation, Task, Action, Result, active listening, collaboration', 'Use the STAR method: Describe the specific conflict situation, your objective, your constructive communication and empathy-based action, and the positive result for the project and relationship.', TRUE, NOW()),
(8, 'HR', 'Why do you want to join our organization and where do you see yourself in 3 years?', 'Easy', 'company alignment, growth mindset, technical mastery, mentorship, value creation', 'Connect your passion for the company''s domain and engineering culture to your personal milestones: mastering core tech, mentoring peers, and driving impactful customer solutions.', TRUE, NOW());
