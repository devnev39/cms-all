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
import com.cms.cms.models.dto.CouponTypeDTO;
import com.cms.cms.models.entity.CouponType;
import com.cms.cms.repository.CouponTypeRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/coupon_type")
@CrossOrigin("http://localhost:5173")
@AllArgsConstructor
public class CouponTypeController {
    
    private CouponTypeRepository repo;

    @GetMapping("")
    public List<CouponType> getAllCouponTypes() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public CouponType getCouponType(@PathVariable Long id) {
        Optional<CouponType> ct = repo.findById(id);
        if (!ct.isPresent()) throw new CustomEntityNotFoundException("Coupon type");
        return ct.get();
    }

    @PostMapping("")
    public CouponType createCouponType(@RequestBody CouponType type) {
        type.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
        return repo.save(type);
    }

    @PatchMapping("/{id}")
    public CouponType updateCouponType(@PathVariable Long id, @RequestBody CouponTypeDTO dto) {
        Optional<CouponType> opt = repo.findById(id);
        if (!opt.isPresent()) throw new CustomEntityNotFoundException("Coupon type");
        else {
            CouponType current = opt.get();
            if (dto.getType().isPresent()) {
                current.setType(dto.getType().get());
            }
            if (dto.getDiscountPerCoupon().isPresent()) {
                current.setDiscountPerCoupon(dto.getDiscountPerCoupon().get());
            }
            if (dto.getMinCount().isPresent()) {
                current.setMinCount(dto.getMinCount().get());
            }
            if (dto.getOriginalPrice().isPresent()) {
                current.setOriginalPrice(dto.getOriginalPrice().get());
            }

            current.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            current.setUpdatedBy(CurrentUser.getCurrentUser().getEmail());

            return repo.save(current);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteCouponType(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Coupon type deleted successfully !");
    }
}
