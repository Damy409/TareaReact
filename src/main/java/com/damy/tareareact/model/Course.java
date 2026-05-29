package com.damy.tareareact.model;

public class Course {
    private Long id;
    private String name;
    private String area;
    private String description;

    public Course(Long id, String name, String area, String description) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getArea() {
        return area;
    }

    public String getDescription() {
        return description;
    }
}
