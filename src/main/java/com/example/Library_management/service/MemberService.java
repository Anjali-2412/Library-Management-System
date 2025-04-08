package com.example.Library_management.service;

import com.example.Library_management.entity.Member;
import com.example.Library_management.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public void save (Member member){
        memberRepository.save(member);
    }

    public void deleteMemberById(long id){
        memberRepository.deleteById(id);
    }

    public List<Member> listMember(){
        return memberRepository.findAll();
    }

    public Member findById(long id){
        return memberRepository.findById(id).orElse(null);
    }


}
