package com.example.Library_management.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "IssueBooks")
public class IssuedBook {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        private Member member;

        @ManyToOne
        private Book book;

        private LocalDate issueDate;
        private LocalDate returnDate;
        private double fine = 0;
        private boolean returned =false;

        @Column(name = "fine_paid")
        private Boolean finepaid =false;

        @Column(name ="payment_mode")
        private String paymentMode;




}
