package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.ItemDTO;
import com.cms.cms.models.entity.Item;
import com.cms.cms.repository.ItemRepository;
import com.cms.cms.utils.CurrentUser;

@RestController
@RequestMapping("/item")
public class ItemController {
    
    @Autowired
    private ItemRepository repo;

    @GetMapping("")
    public List<Item> getAllItems() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        Optional<Item> item = repo.findById(id);
        if (!item.isPresent()) throw new CustomEntityNotFoundException("Item");
        return item.get();
    }

    @PostMapping("")
    public Item createItem(@RequestBody Item item) {
        item.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
        return repo.save(item);
    }

    @PatchMapping("/${id}")
    public Item updateItem(@PathVariable Long id, @RequestBody ItemDTO dto) {
        Optional<Item> item = repo.findById(id);
        if (!item.isPresent()) throw new CustomEntityNotFoundException("Item");
        else {
            Item current = item.get();
            if (dto.getName().isPresent()) {
                current.setName(dto.getName().get());
            }

            if (dto.getPrice().isPresent()) {
                current.setPrice(dto.getPrice().get());
            }

            current.setUpdatedBy(CurrentUser.getCurrentUser().getEmail());
            current.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

            return repo.save(current);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteItem(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Item deleted succssfully !");
    }
}
