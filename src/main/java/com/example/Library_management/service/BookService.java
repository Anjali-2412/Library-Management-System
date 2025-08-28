package com.example.Library_management.service;

import com.example.Library_management.entity.Book;
import com.example.Library_management.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    public void save(Book book){
        // Set availability based on quantity
        book.setAvailability(book.getQuantity() > 0);
        bookRepository.save(book);
    }

    @Transactional
    public Book saveAndReturn(Book book) {
        book.setAvailability(book.getQuantity() > 0);
        return bookRepository.save(book);
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
