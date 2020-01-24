package com.user.crslider.controllers;

import com.user.crslider.models.Questionnaire;
import com.user.crslider.repositories.QuestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping(value = "/questionnaire")
public class QuestionnaireController {
    private final QuestionnaireRepository questionnaireRepository;

    @Autowired
    public QuestionnaireController(QuestionnaireRepository questionnaireRepository) {
        this.questionnaireRepository = questionnaireRepository;
    }

    @GetMapping
    public List<Questionnaire> getItemGroups(Sort sort) {
        return questionnaireRepository.findAll(sort);
    }

    @GetMapping("{userUid}/{code}")
    public List<Questionnaire> getBy(@PathVariable String userUid, @PathVariable String code) {
        return questionnaireRepository.findByUserUidAndCode(userUid, code);
    }

    @Transactional
    @PostMapping
    public void saveQuestionnaire(@RequestBody List<Questionnaire> questionnairesToSave) {
        for (Questionnaire questionnaire : questionnairesToSave) {
            Questionnaire questionnaireSaved = questionnaireRepository.findByUserUidAndCodeAndQuestionCode(
                    questionnaire.getUserUid(),
                    questionnaire.getCode(),
                    questionnaire.getQuestionCode());

            if (questionnaireSaved == null) {
                questionnaireSaved = new Questionnaire();
                questionnaireSaved.setCode(questionnaire.getCode());
                questionnaireSaved.setQuestionCode(questionnaire.getQuestionCode());
                questionnaireSaved.setUserUid(questionnaire.getUserUid());
            }

            questionnaireSaved.setAnswer(questionnaire.getAnswer());

            questionnaireRepository.save(questionnaireSaved);
        }
    }
}
