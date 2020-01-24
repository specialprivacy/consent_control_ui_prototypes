package com.odrozd.crslider.controllers;

import com.odrozd.crslider.models.Preferences;
import com.odrozd.crslider.repositories.PreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

@RestController
@RequestMapping(value = "/preferences")
public class PreferencesController {
    private final PreferencesRepository preferencesRepository;

    @Autowired
    public PreferencesController(PreferencesRepository preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }

    @Transactional
    @PostMapping
    public void save(@RequestBody Preferences preferences) {
        preferencesRepository.save(preferences);
    }
}
