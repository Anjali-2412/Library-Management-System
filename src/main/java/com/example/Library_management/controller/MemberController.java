package com.example.Library_management.controller;

import com.example.Library_management.entity.Member;
import com.example.Library_management.repository.MemberRepository;
import com.example.Library_management.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import java.util.List;

@RestController
@RequestMapping("/member")
@CrossOrigin(origins = "*")
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

    @PutMapping("/{id}")
    public ResponseEntity<String> updateMember(@PathVariable Long id,@RequestBody Member updatedMember){
        Member existingMember = memberService.findById(id);
        if (existingMember == null){
            return  ResponseEntity.notFound().build();
        }
        existingMember.setName(updatedMember.getName());
        existingMember.setEmail(updatedMember.getEmail());
        existingMember.setOutstandingDept(updatedMember.getOutstandingDept());
        existingMember.setPhone(updatedMember.getPhone());


        memberService.save(existingMember);
        return ResponseEntity.ok("Member updated");
    }




    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable Long id) {
        memberService.deleteMemberById(id);
    }
}
