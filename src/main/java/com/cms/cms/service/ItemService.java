package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.Item.ItemDTO;
import com.cms.cms.models.entity.Item;
import com.cms.cms.repository.ItemRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class ItemService {
	private ItemRepository repo;
	
    public List<Item> getAllItems() {
        return repo.findAll();
    }

  
    public Item getItemById(Long id) {
        Optional<Item> item = repo.findById(id);
        if (!item.isPresent()) throw new CustomEntityNotFoundException("Item");
        return item.get();
    }

    
    public Item createItem( Item item) {
        item.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
        return repo.save(item);
    }

    
    public Item updateItem( Long id, ItemDTO dto) {
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


    public OperationResponse deleteItem(Long id) {
        repo.deleteById(id);
        return new OperationResponse("Item deleted succssfully !");
    }
}
