package com.example.backend.payload.request;

import java.util.Map;

public class ExamSubmitRequest {
    // Map of questionId to selectedOption ("A", "B", "C", "D")
    private Map<Long, String> answers;

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
