package com.example.backend.controller;

import com.example.backend.model.ExamResult;
import com.example.backend.model.Question;
import com.example.backend.model.User;
import com.example.backend.payload.request.ExamSubmitRequest;
import com.example.backend.repository.ExamResultRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    ExamResultRepository examResultRepository;

    @Autowired
    UserRepository userRepository;

    // Get all questions without the correctOption for the frontend
    @GetMapping("/questions")
    public ResponseEntity<?> getQuestions() {
        List<Question> questions = questionRepository.findAll();
        // Remove correct option from response so client doesn't see it
        List<Map<String, Object>> safeQuestions = questions.stream().map(q -> (Map<String, Object>) Map.<String, Object>of(
                "id", q.getId(),
                "text", q.getText(),
                "optionA", q.getOptionA(),
                "optionB", q.getOptionB(),
                "optionC", q.getOptionC(),
                "optionD", q.getOptionD()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(safeQuestions);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(@RequestBody ExamSubmitRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        int score = 0;
        List<Question> allQuestions = questionRepository.findAll();

        for (Question q : allQuestions) {
            String selectedOption = request.getAnswers().get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                score++;
            }
        }

        ExamResult result = new ExamResult();
        result.setUser(user);
        result.setScore(score);
        result.setTotalQuestions(allQuestions.size());
        result.setDateTaken(LocalDateTime.now());

        examResultRepository.save(result);

        return ResponseEntity.ok(Map.of(
                "message", "Exam submitted successfully",
                "score", score,
                "totalQuestions", allQuestions.size()
        ));
    }

    @GetMapping("/results")
    public ResponseEntity<?> getMyResults() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ExamResult> results = examResultRepository.findByUserId(userDetails.getId());
        
        List<Map<String, Object>> formattedResults = results.stream().map(r -> (Map<String, Object>) Map.<String, Object>of(
                "id", r.getId(),
                "score", r.getScore(),
                "totalQuestions", r.getTotalQuestions(),
                "dateTaken", r.getDateTaken()
        )).collect(Collectors.toList());
        
        return ResponseEntity.ok(formattedResults);
    }
}
