package com.odrozd.crslider.controllers;

import com.odrozd.crslider.models.Item;
import com.odrozd.crslider.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/item")
public class ItemController {
    private final ItemRepository itemRepository;

    @Autowired
    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Item> getItems(@RequestHeader HttpHeaders headers, Sort sort) {
        String locale = headers.get("Locale").get(0);
        return itemRepository.findAll(sort).stream().map(s -> {
            if (locale.equals("de")) {
                s.setName(s.getNameDe());
            }
            return s;
        }).collect(Collectors.toList());
    }
}
