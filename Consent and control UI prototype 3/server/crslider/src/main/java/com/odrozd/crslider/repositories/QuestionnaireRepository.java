package com.user.crslider.repositories;

import com.user.crslider.models.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    Questionnaire findByUserUidAndCodeAndQuestionCode(String userUid, String code, String questionCode);

    List<Questionnaire> findByUserUidAndCode(String userUid, String code);
}
