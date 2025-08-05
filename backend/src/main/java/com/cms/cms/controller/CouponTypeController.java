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
import com.cms.cms.models.dto.CouponType.CouponTypeDTO;
import com.cms.cms.models.dto.CouponType.NewCouponTypeDTO;
import com.cms.cms.models.entity.CouponType;
import com.cms.cms.service.CouponTypeService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/coupon_type")
@CrossOrigin(origins = {"*"})
@AllArgsConstructor
public class CouponTypeController {
    
    private final CouponTypeService couponTypeService;

    @GetMapping("")
    public List<CouponType> getAllCouponTypes() {
       return couponTypeService.getAllCouponTypes();
    }

    @GetMapping("/{id}")
    public CouponType getCouponType(@PathVariable Long id) {
        return couponTypeService.getCouponType(id);
    }

    @PostMapping("")
    public CouponType createCouponType(@Valid @RequestBody NewCouponTypeDTO type, BindingResult result) {
        System.out.println("In create Coupon Type******");
    	if(result.hasErrors()){
            throw new InvalidInputException("CouponType", result);
        }
        return couponTypeService.createCouponType(type, result);
    }

    @PatchMapping("/{id}")
    public CouponType updateCouponType(@PathVariable Long id, @RequestBody CouponTypeDTO dto) {
            return couponTypeService.updateCouponType(id, dto);
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteCouponType(@PathVariable Long id) {
        return couponTypeService.deleteCouponType(id);
    }
}
