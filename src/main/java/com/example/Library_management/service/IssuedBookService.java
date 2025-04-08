package com.example.Library_management.service;

import com.example.Library_management.entity.IssuedBook;
import com.example.Library_management.repository.IssuedBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssuedBookService
{

    @Autowired
    private IssuedBookRepository issuedBookRepository;

    public void save(IssuedBook issuedBook){
        issuedBookRepository.save(issuedBook);
    }

    public IssuedBook findById(long id){
        return issuedBookRepository.findById(id).orElse(null);
    }

    public List<IssuedBook> getIssueBook(){
        return issuedBookRepository.findAll();
    }
}
