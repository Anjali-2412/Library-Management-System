package com.example.Library_management.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@Table(name = "members", uniqueConstraints = { @UniqueConstraint(columnNames = { "email", "phone" }) })
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    //@Column(unique = true)
    private String email;
    private  String phone;
    private double outstandingDept;

   // @Version
    //private Integer version; //Handles optimistic Locking

}
