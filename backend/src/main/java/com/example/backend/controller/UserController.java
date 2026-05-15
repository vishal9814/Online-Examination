package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.payload.request.PasswordUpdateRequest;
import com.example.backend.payload.request.ProfileUpdateRequest;
import com.example.backend.payload.response.MessageResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userRepository.findById(userDetails.getId());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFullName(request.getFullName());
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userRepository.findById(userDetails.getId());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Old password is incorrect"));
            }
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Password updated successfully"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }
}
