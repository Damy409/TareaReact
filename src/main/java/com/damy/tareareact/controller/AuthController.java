package com.damy.tareareact.controller;

import com.damy.tareareact.dto.AuthResponse;
import com.damy.tareareact.dto.LoginRequest;
import com.damy.tareareact.dto.UserResponse;
import com.damy.tareareact.model.User;
import com.damy.tareareact.service.DataStore;
import com.damy.tareareact.service.JwtService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/api/auth")
public class AuthController {
    private final DataStore dataStore;
    private final JwtService jwtService;

    public AuthController(DataStore dataStore, JwtService jwtService) {
        this.dataStore = dataStore;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return dataStore.findUser(request.username(), request.password())
                .<ResponseEntity<?>>map(this::createAuthResponse)
                .orElseGet(() -> ResponseEntity.status(401)
                        .body(Map.of("message", "Usuario o contrasena incorrectos.")));
    }

    private ResponseEntity<AuthResponse> createAuthResponse(User user) {
        return ResponseEntity.ok(new AuthResponse(
                jwtService.createToken(user),
                new UserResponse(user.getId(), user.getUsername())));
    }
}
