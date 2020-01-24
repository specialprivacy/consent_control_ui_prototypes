package com.user.crslider.models;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Entity(name = "preferences")
public class Preferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 68)
    @Column(name = "user_uid")
    private String userUid;

    @Column(name = "value")
    private String value;
}