package com.odrozd.crslider.repositories;

import com.odrozd.crslider.models.ItemGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemGroupRepository extends JpaRepository<ItemGroup, Long> {}
