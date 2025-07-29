package com.cms.cms.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.cms.cms.models.dto.Caterer.CatererDTO;
import com.cms.cms.models.dto.Caterer.NewCatererDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.service.CatererService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/caterer")
@AllArgsConstructor
public class CatererController {
    private final CatererService catererService;

    @GetMapping("")
    public List<Caterer> getAllCaterers() {
        return catererService.getAllCaterers();
    }

    @GetMapping("/{id}")
    public Caterer getCaterer(@PathVariable Long id) {
       return catererService.getCaterer(id);
    }

    @PostMapping("")
    public Caterer createCaterer(@Valid @RequestBody NewCatererDTO caterer, BindingResult result) {
    	if(result.hasErrors()) {
    		throw new InvalidInputException("Caterer", result);
    	}
       return catererService.createCaterer(caterer);
    }

    @PatchMapping("/{id}")
    public Caterer updateCaterer(@PathVariable Long id, @RequestBody CatererDTO caterer) {
       return catererService.updateCaterer(id, caterer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCaterer(@PathVariable Long id) {
        if (catererService.deleteCaterer(id)) {
            return new ResponseEntity<OperationResponse>(new OperationResponse("Caterer deleted successfully !"), HttpStatus.OK);
        }
        return new ResponseEntity<OperationResponse>(new OperationResponse("Error occured !"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
