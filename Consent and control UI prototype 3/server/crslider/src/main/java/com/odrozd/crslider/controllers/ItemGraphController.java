package com.user.crslider.controllers;

import com.user.crslider.models.ItemGraph;
import com.user.crslider.repositories.ItemGraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/itemgraph")
public class ItemGraphController {
    private final ItemGraphRepository itemGraphRepository;

    @Autowired
    public ItemGraphController(ItemGraphRepository itemGraphRepository) {
        this.itemGraphRepository = itemGraphRepository;
    }

    @GetMapping
    public List<ItemGraph> getItemGraphs(Sort sort) {
        return itemGraphRepository.findAll(sort);
    }
}
