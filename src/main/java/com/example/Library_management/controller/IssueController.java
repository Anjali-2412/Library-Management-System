package com.example.Library_management.controller;


import com.example.Library_management.entity.Book;
import com.example.Library_management.entity.IssuedBook;
import com.example.Library_management.entity.Member;
import com.example.Library_management.service.BookService;
import com.example.Library_management.service.IssuedBookService;
import com.example.Library_management.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/issuebook")
public class IssueController {

    @Autowired
    private IssuedBookService issuedBookService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<IssuedBook> getIssueBook(){
        return issuedBookService.getIssueBook();
    }

    @PostMapping
    public ResponseEntity<String> issueBook(@RequestParam Long memberId, @RequestParam Long bookId) {
        Member member = memberService.findById(memberId);
        Book book = bookService.findById(bookId);

        if (member == null || book == null)
            return ResponseEntity.badRequest().body("Invalid IDs");

        if (book.getQuantity() <= 0)
            return ResponseEntity.badRequest().body("Book is out of stock");

        if (member.getOutstandingDept() >= 500)
            return ResponseEntity.badRequest().body("Member has exceeded debt limit");

        IssuedBook issue = new IssuedBook();
        issue.setBook(book);
        issue.setMember(member);
        issue.setIssueDate(LocalDate.now());
        issuedBookService.save(issue);

        book.setQuantity(book.getQuantity() - 1);
        book.setAvailability(book.getQuantity() > 0);
        bookService.save(book);

        return ResponseEntity.ok("Book issued successfully");
    }
    @PostMapping("/return/{issueId}")
    public ResponseEntity<String> returnBook(@PathVariable Long issueId){
            IssuedBook issue = issuedBookService.findById(issueId);

            if (issue==null || issue.isReturned()){
                return ResponseEntity.badRequest().body("Invalid or already returned");

            }
            issue.setReturned(true);
            issue.setReturnDate(LocalDate.now());

            long days = ChronoUnit.DAYS.between(issue.getIssueDate(),issue.getReturnDate());
            double fine = days >14 ? (days-14)*10 :0;
            issue.setFine(fine);

            Member member = issue.getMember();
            member.setOutstandingDept(member.getOutstandingDept() + fine);

            Book book = issue.getBook();
            book.setQuantity(book.getQuantity()+1);
            book.setAvailability(true);

            issuedBookService.save(issue);
             return ResponseEntity.ok("Book Returned Successfully. Fine : Rs "+fine);






    }


}
