package com.example.backend.config;

import com.example.backend.model.Question;
import com.example.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (questionRepository.count() == 0) {
            questionRepository.save(new Question(null, "Which of the following is a feature of Java?", "Object-oriented", "Use of pointers", "Platform dependent", "None of the above", "A"));
            questionRepository.save(new Question(null, "Which component is used to compile, debug and execute the java programs?", "JRE", "JIT", "JDK", "JVM", "C"));
            questionRepository.save(new Question(null, "What is the extension of java code files?", ".js", ".txt", ".class", ".java", "D"));
            questionRepository.save(new Question(null, "Which environment variable is used to set the java path?", "MAVEN_PATH", "JavaPATH", "JAVA", "JAVA_HOME", "D"));
            questionRepository.save(new Question(null, "Which of the following is not an OOPS concept in Java?", "Polymorphism", "Inheritance", "Compilation", "Encapsulation", "C"));
            System.out.println("Questions seeded successfully!");
        }
    }
}
