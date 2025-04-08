package com.example.Library_management.service;

import com.example.Library_management.entity.Book;
import com.example.Library_management.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public void save(Book book){
        bookRepository.save(book);
    }

    public void deleteBookById(long id){
        bookRepository.deleteById(id);
    }

    public List<Book> ListBooks(){
        return bookRepository.findAll();
    }

    public Optional<Book> findBookById(Long id){
        return bookRepository.findById(id);
    }

    public Book findBooksByTitle(String title){

        return bookRepository.findByTitle(title);

    }


    public Book findByIsbn(String isbn) {
        return  bookRepository.findByIsbn(isbn);
    }

    public Book findById(long id){
        return bookRepository.findById(id).orElse(null);
    }

}
