package com.odrozd.crslider.models;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Entity(name = "questionnaire")
public class Questionnaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 68)
    @Column(name = "user_uid")
    private String userUid;

    @NotBlank
    @Size(max = 50)
    @Column(name = "code")
    private String code;

    @NotBlank
    @Size(max = 50)
    @Column(name = "question_code")
    private String questionCode;

    @Column(name = "answer")
    private String answer;
}
