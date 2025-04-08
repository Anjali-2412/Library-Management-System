package com.example.Library_management.controller;

import com.example.Library_management.entity.Member;
import com.example.Library_management.repository.MemberRepository;
import com.example.Library_management.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/add")
    public Boolean addMember(@RequestBody Member member){
        memberService.save(member);
        return true;
    }

    @GetMapping
    public List<Member> getAllMember(){
        return memberService.listMember();
    }

}
