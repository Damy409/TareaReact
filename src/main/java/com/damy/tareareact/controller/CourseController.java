package com.damy.tareareact.controller;

import com.damy.tareareact.dto.CourseRequest;
import com.damy.tareareact.model.Course;
import com.damy.tareareact.service.DataStore;
import com.damy.tareareact.service.JwtService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/api/courses")
public class CourseController {
    private final DataStore dataStore;
    private final JwtService jwtService;

    public CourseController(DataStore dataStore, JwtService jwtService) {
        this.dataStore = dataStore;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> listCourses(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (!isAuthorized(authorization)) {
            return unauthorized();
        }

        return ResponseEntity.ok(dataStore.getCourses());
    }

    @PostMapping
    public ResponseEntity<?> createCourse(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody CourseRequest request) {
        if (!isAuthorized(authorization)) {
            return unauthorized();
        }

        if (isBlank(request.name()) || isBlank(request.area())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "El nombre del curso y el area academica son obligatorios."));
        }

        Course course = dataStore.createCourse(request.name(), request.area(), request.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }

    private boolean isAuthorized(String authorization) {
        return authorization != null
                && authorization.startsWith("Bearer ")
                && jwtService.isValid(authorization.substring("Bearer ".length()));
    }

    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "No autorizado. Inicia sesion primero."));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
