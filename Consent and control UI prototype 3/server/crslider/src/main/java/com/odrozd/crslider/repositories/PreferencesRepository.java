package com.user.crslider.repositories;

import com.user.crslider.models.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferencesRepository  extends JpaRepository<Preferences, Long> {
}
