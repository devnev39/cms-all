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
import com.cms.cms.models.dto.Coupon.CouponDTO;
import com.cms.cms.models.dto.Coupon.NewCouponDTO;
import com.cms.cms.models.entity.Coupon;
import com.cms.cms.models.entity.CouponType;
import com.cms.cms.models.entity.User;
import com.cms.cms.repository.CouponRepository;
import com.cms.cms.repository.CouponTypeRepository;
import com.cms.cms.repository.UserRepository;
import com.cms.cms.utils.CurrentUser;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/coupon")
@CrossOrigin("http://localhost:5173")
@AllArgsConstructor
public class CouponController {
    
    private CouponRepository repo;
    private UserRepository userRepo;
    private CouponTypeRepository couponTypeRepo;
    private final ModelMapper mapper;

    @GetMapping("")
    public List<Coupon> getAllCoupons() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Coupon getCouponById(@PathVariable Long id) {
        Optional<Coupon> coupon = repo.findById(id);
        if (!coupon.isPresent()) throw new CustomEntityNotFoundException("Coupon");
        return coupon.get();
    }

    @PostMapping("")
    public Coupon createCoupon(@Valid @RequestBody NewCouponDTO coupon) {
        User u = userRepo.findById(coupon.getUserId()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
        CouponType ct = couponTypeRepo.findById(coupon.getCouponTypeId()).orElseThrow(() -> new CustomEntityNotFoundException("Coupon Type"));
        Coupon c = mapper.map(coupon, Coupon.class);

        c.setUser(u);
        c.setCouponType(ct);
        c.setCreatedBy(CurrentUser.getCurrentUser().getEmail());

        return repo.save(c);
    }

    @PatchMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody CouponDTO dto) {
        Optional<Coupon> opt = repo.findById(id);
        if (!opt.isPresent()) throw new CustomEntityNotFoundException("Coupon");
        else {
            Coupon current = opt.get();
            if (dto.getCount().isPresent()) {
                current.setCount(dto.getCount().get());
            }
            if (dto.getValidity().isPresent()) {
                current.setValidity(dto.getValidity().get());
            }
            if (dto.getUserId().isPresent()) {
                User u = userRepo.findById(dto.getUserId().get()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
                current.setUser(u);
            }
            if (dto.getCouponTypeId().isPresent()) {
                CouponType ct = couponTypeRepo.findById(dto.getCouponTypeId().get()).orElseThrow(() -> new CustomEntityNotFoundException("Coupon Type"));
                current.setCouponType(ct);
            }
            current.setUpdatedBy(CurrentUser.getCurrentUser().getEmail());
            current.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

            return repo.save(current);
        }
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteCoupon(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Coupon deleted successfully !");
    } 
}
