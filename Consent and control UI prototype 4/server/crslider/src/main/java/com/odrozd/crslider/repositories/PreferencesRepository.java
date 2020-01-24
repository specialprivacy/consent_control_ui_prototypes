package com.odrozd.crslider.repositories;

import com.odrozd.crslider.models.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferencesRepository  extends JpaRepository<Preferences, Long> {
}
