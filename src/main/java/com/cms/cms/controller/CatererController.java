package com.cms.cms.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
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
import com.cms.cms.models.dto.Caterer.CatererDTO;
import com.cms.cms.models.dto.Caterer.NewCatererDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.CatererRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/caterer")
@AllArgsConstructor
public class CatererController {
    
    private final CatererRepository repo;
    private final UserRepository userRepo;
    private final ModelMapper mapper;

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
    public Caterer createCaterer(@Valid @RequestBody NewCatererDTO caterer) {
        // get current logged in user
        User u = CurrentUser.getCurrentUser();

        // get the caterer user
        User catererUser = userRepo.findById(caterer.getUserId()).orElseThrow(() -> new CustomEntityNotFoundException("User"));

        // map caterer
        Caterer c = mapper.map(caterer, Caterer.class);
        c.setUser(catererUser);
        
        // set the id to null
        c.setId(null);

        // Update the created_by field
        c.setCreatedBy(u.getEmail());
        return repo.save(c);
    }

    @PatchMapping("/{id}")
    public Caterer updateCaterer(@PathVariable Long id, @RequestBody CatererDTO caterer) {
        Optional<Caterer> ct = repo.findById(id);
        if (!ct.isPresent()) throw new CustomEntityNotFoundException("Caterer");
        else {
            Caterer ctf = ct.get();
            if (caterer.getName().isPresent()) {
                ctf.setName(caterer.getName().get());
            }
            if (caterer.getUserId().isPresent()) {
                User u = userRepo.findById(caterer.getUserId().get()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
                ctf.setUser(u);
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
