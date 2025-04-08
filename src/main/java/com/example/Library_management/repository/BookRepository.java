package com.example.Library_management.repository;

import com.example.Library_management.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {


    Book findByTitle(String title);
    Book findByIsbn(String isbn);



}
