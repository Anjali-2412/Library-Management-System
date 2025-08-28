package com.example.Library_management.controller;


import com.example.Library_management.entity.Book;
import com.example.Library_management.entity.IssuedBook;
import com.example.Library_management.entity.Member;
import com.example.Library_management.service.BookService;
import com.example.Library_management.service.IssuedBookService;
import com.example.Library_management.service.MemberService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/issuebook")
@CrossOrigin(origins = "*")
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

    @Transactional
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


            //issue.setReturned(true);
            issue.setReturnDate(LocalDate.now());

            long days = ChronoUnit.DAYS.between(issue.getIssueDate(),issue.getReturnDate());
            double fine = days >=14 ? (days-14)*10 :0;
            issue.setFine(fine);
            issuedBookService.save(issue); // Save fine immediately

           // issue.setFinepaid(false);//not paid yet
           // issue.setPaymentMode(null);//not selected yet

            //check if fine needs to be paid
            if(fine >0 && !issue.getFinepaid()){
            return ResponseEntity.badRequest().body("Fine of Rs "+fine+" not paid. please pay before return the book");
            }

            //Procced to mark as returned
            issue.setReturned(true);

            //update issuebook fine field
            issue.setFine(fine);

            //update member
            Member member = issue.getMember();
            member.setOutstandingDept(member.getOutstandingDept() + fine);

            //update book
            Book book = issue.getBook();
            book.setQuantity(book.getQuantity()+1);
            book.setAvailability(true);

            issuedBookService.save(issue);
             return ResponseEntity.ok("Book Returned Successfully. Fine : Rs "+fine);






    }

    @GetMapping("/active")
    public List<IssuedBook> getActiveIssues(){

        return issuedBookService.FindByReturnedFalse();
    }
    @PatchMapping("/pay-fine-offline/{issueId}")
    public ResponseEntity<String> markFineAsPaidOffline(@PathVariable Long issueId){
        IssuedBook issue  = issuedBookService.findById(issueId);

        if(issue==null){
            return ResponseEntity.badRequest().body("Invalid issue Id");
        }
        if(issue.getFine() <=0){
            return ResponseEntity.badRequest().body("No fine to be paid");
        }
        if(issue.getFinepaid()){
            return ResponseEntity.ok("Fine already marked as paid");
        }

        issue.setFinepaid(true);
        //update member's outstandingDept (subtract the fine if already added)
        Member member = issue.getMember();
        member.setOutstandingDept(member.getOutstandingDept() - issue.getFine());
        //
        //Procced to mark as returned
        issue.setReturned(true);
        issuedBookService.save(issue);

        return ResponseEntity.ok("Fine marked as paid successfully (offline)");

    }


    @PostMapping("/pay-fine-online/{issueId}")
    public ResponseEntity<String> markFineAsPaidOnline(
            @PathVariable Long issueId,
            @RequestParam String paymentMode){

        IssuedBook issue = issuedBookService.findById(issueId);
        if(issue == null || !issue.isReturned()){
            return ResponseEntity.badRequest().body("Book not yet returned or issue not found");

        }
        if(issue.getFine() <=0 || issue.getFinepaid()){
            return ResponseEntity.badRequest().body("Book not yet returned or issue not found");

        }

        issue.setFinepaid(true);
        issue.setPaymentMode(paymentMode);

        issuedBookService.save(issue);
        return ResponseEntity.ok("Fine paid successfully using"+paymentMode);



    }




}
