package com.example.Library_management.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.Date;


@Entity
@Data
@NoArgsConstructor
@Table(name = "book", uniqueConstraints = { @UniqueConstraint(columnNames = { "title", "author", "publisher", "publicationDate", "languageCode" }) })
public class Book{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;
    private String isbn;
    private String author;
    private String publisher;

    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date publicationDate;
    private String languageCode;
    private int quantity;
    private int rentingCost;
    private double price;
    private Boolean availability;


}