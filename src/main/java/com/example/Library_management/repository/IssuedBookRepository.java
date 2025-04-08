package com.example.Library_management.repository;

import com.example.Library_management.entity.IssuedBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssuedBookRepository extends JpaRepository<IssuedBook,Long> {
}
