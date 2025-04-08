package com.example.Library_management.controller;

import com.example.Library_management.entity.Book;
import com.example.Library_management.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBook(){
        return bookService.ListBooks();
    }

    @GetMapping("{isbn}")
    public Book findByISBN(@PathVariable String isbn){
        return bookService.findByIsbn(isbn);
    }

    @GetMapping("/search/{title}")
    public Book findBooksByTittle (@PathVariable String title){
        return bookService.findBooksByTitle(title);
    }

    @PostMapping
    public boolean addBook(@RequestBody Book book){
        bookService.save(book);
        return true;
    }

    @PutMapping("/edit/{title}")
    public ResponseEntity<Book> updateBook(@PathVariable String title,@RequestBody Book update){

        Book exist_book =  bookService.findBooksByTitle(title);
        if (exist_book != null){
            exist_book.setTitle(update.getTitle());
            exist_book.setAuthor(update.getAuthor());
            exist_book.setPublisher(update.getPublisher());
            exist_book.setLanguageCode(update.getLanguageCode());
            exist_book.setRentingCost(update.getRentingCost());
            exist_book.setQuantity(update.getQuantity());
            exist_book.setPublicationDate(update.getPublicationDate());
            exist_book.setPrice(update.getPrice());
            exist_book.setIsbn(update.getIsbn());
            exist_book.setAvailability(update.getAvailability());

            bookService.save(exist_book);
            return new ResponseEntity<>(exist_book,HttpStatus.OK);
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete/{id}")
    public boolean removeBookByTitle(@PathVariable long id){
    bookService.deleteBookById(id);
    return true;
    }


}
