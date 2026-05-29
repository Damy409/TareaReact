package com.damy.tareareact.service;

import com.damy.tareareact.model.Course;
import com.damy.tareareact.model.User;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class DataStore {
    private final List<User> users = new ArrayList<>();
    private final List<Course> courses = new ArrayList<>();

    public DataStore() {
        loadInitialData();
    }

    public Optional<User> findUser(String username, String password) {
        return users.stream()
                .filter(user -> user.getUsername().equals(username) && user.getPassword().equals(password))
                .findFirst();
    }

    public List<Course> getCourses() {
        return courses;
    }

    public Course createCourse(String name, String area, String description) {
        Course course = new Course(
                (long) courses.size() + 1,
                name.trim(),
                area.trim(),
                description == null ? "" : description.trim());
        courses.add(0, course);
        return course;
    }

    private void loadInitialData() {
        String sql = readDataSql();

        Matcher userMatcher = Pattern
                .compile("INSERT INTO users \\(username, password\\) VALUES \\('([^']+)', '([^']+)'\\);")
                .matcher(sql);

        while (userMatcher.find()) {
            users.add(new User((long) users.size() + 1, userMatcher.group(1), userMatcher.group(2)));
        }

        Matcher courseMatcher = Pattern.compile("\\('([^']+)', '([^']+)', '([^']+)'\\)").matcher(sql);

        while (courseMatcher.find()) {
            if (!"admin".equals(courseMatcher.group(1))) {
                courses.add(new Course(
                        (long) courses.size() + 1,
                        courseMatcher.group(1),
                        courseMatcher.group(2),
                        courseMatcher.group(3)));
            }
        }
    }

    private String readDataSql() {
        try (InputStream inputStream = new ClassPathResource("data.sql").getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException error) {
            throw new IllegalStateException("No fue posible leer data.sql", error);
        }
    }
}
