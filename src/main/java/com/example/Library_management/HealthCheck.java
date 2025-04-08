package com.example.Library_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    @GetMapping("/Health")
    public String Check(){
        return "Hello , I'm health checker";
    }
}
