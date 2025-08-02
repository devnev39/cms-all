package com.cms.cms.controller;

import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.InvalidInputException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.Item.ItemDTO;
import com.cms.cms.models.dto.Item.NewItemDTO;
import com.cms.cms.models.entity.Item;
import com.cms.cms.service.ItemService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/item")
@CrossOrigin(origins = {"*"})
@AllArgsConstructor
public class ItemController {
    
    private ItemService itemService;

    @GetMapping("")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        Item  item =itemService.getItemById(id);
        
        return item;
    }

    @PostMapping("")
    public Item createItem(@Valid @RequestBody NewItemDTO item,BindingResult result) {
    	 if (result.hasErrors()) {
             throw new InvalidInputException("Item", result);
         }
         return itemService.createItem(item);
    }

    @PatchMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody ItemDTO dto) {
        return  itemService.updateItem(id, dto);
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteItem(@PathVariable Long id) {
    	return itemService.deleteItem(id);
    }
}
