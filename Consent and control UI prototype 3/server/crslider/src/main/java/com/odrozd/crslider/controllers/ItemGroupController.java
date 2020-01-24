package com.user.crslider.controllers;

import com.user.crslider.models.ItemGroup;
import com.user.crslider.repositories.ItemGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/itemgroup")
public class ItemGroupController {
    private final ItemGroupRepository itemGroupRepository;

    @Autowired
    public ItemGroupController(ItemGroupRepository itemGroupRepository) {
        this.itemGroupRepository = itemGroupRepository;
    }

    @GetMapping
    public List<ItemGroup> getItemGroups(Sort sort) {
        return itemGroupRepository.findAll(sort);
    }
}
