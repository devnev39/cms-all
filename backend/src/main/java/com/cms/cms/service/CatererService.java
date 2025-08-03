package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.dto.Caterer.CatererDTO;
import com.cms.cms.models.dto.Caterer.NewCatererDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.CatererRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class CatererService {
    private final CatererRepository repo;
    private final UserRepository userRepo;
    private final ModelMapper mapper; 

    public List<Caterer> getAllCaterers() {
        return repo.findAll();
    }

    public Caterer getCatererByClientId(Long clientId) {
        return repo.findByUserId(clientId).orElseThrow(() -> new CustomEntityNotFoundException("Caterer for client with id: " + clientId));
    }

    public Caterer getCaterer(Long id) {
        Optional<Caterer> caterer = repo.findById(id);
        if (!caterer.isPresent()) throw new CustomEntityNotFoundException("caterer");
        return caterer.get();
    }

    public Caterer createCaterer(NewCatererDTO caterer) {
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

    public Caterer updateCaterer(Long id, CatererDTO caterer) {
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

    public boolean deleteCaterer(Long id) {
        repo.deleteById(id);
        return true;
    }
}
