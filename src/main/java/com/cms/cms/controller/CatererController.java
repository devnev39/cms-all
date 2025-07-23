package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.cms.cms.models.dto.CatererDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.CatererRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/caterer")
@AllArgsConstructor
public class CatererController {
    
    private CatererRepository repo;

    @GetMapping("")
    public List<Caterer> getAllCaterers() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Caterer getCaterer(@PathVariable Long id) {
        Optional<Caterer> caterer = repo.findById(id);
        if (!caterer.isPresent()) throw new CustomEntityNotFoundException("caterer");
        return caterer.get();
    }

    @PostMapping("")
    public Caterer createCaterer(@RequestBody Caterer caterer) {
        User u = CurrentUser.getCurrentUser();
        caterer.setCreatedBy(u.getEmail());
        return repo.save(caterer);
    }

    @PatchMapping("/{id}")
    public Caterer updateUser(@PathVariable Long id, @RequestBody CatererDTO caterer) {
        Optional<Caterer> ct = repo.findById(id);
        if (!ct.isPresent()) throw new CustomEntityNotFoundException("Caterer");
        else {
            Caterer ctf = ct.get();
            if (caterer.getName().isPresent()) {
                ctf.setName(caterer.getName().get());
            }
            if (caterer.getUserId().isPresent()) {
                ctf.setUserId(caterer.getUserId().get());
            }

            User u = CurrentUser.getCurrentUser();
            ctf.setUpdatedBy(u.getEmail());
            ctf.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            return repo.save(ctf);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteCaterer(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Caterer deleted successfully !");
    }
}
