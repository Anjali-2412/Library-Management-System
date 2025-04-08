package com.example.Library_management.controller;

import com.example.Library_management.entity.User;
import com.example.Library_management.repository.UserRepository;
import com.example.Library_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/librarian")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup-user")
    public void signupUser(@RequestBody User user){
        userService.saveUser(user);
    }

}
