package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

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

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CouponService {
    private CouponRepository repo;
    private UserRepository userRepo;
    private CouponTypeRepository couponTypeRepo;
    private final ModelMapper mapper;

    public List<Coupon> getAllCoupons() {
        return repo.findAll();
    }

    public Coupon getCouponById( Long id) {
        Optional<Coupon> coupon = repo.findById(id);
        if (!coupon.isPresent()) throw new CustomEntityNotFoundException("Coupon");
        return coupon.get();
    }

    public Coupon createCoupon(NewCouponDTO coupon) {
        User u = userRepo.findById(coupon.getUserId()).orElseThrow(() -> new CustomEntityNotFoundException("User"));
        CouponType ct = couponTypeRepo.findById(coupon.getCouponTypeId()).orElseThrow(() -> new CustomEntityNotFoundException("Coupon Type"));
        Coupon c = mapper.map(coupon, Coupon.class);

        c.setUser(u);
        c.setCouponType(ct);
        c.setCreatedBy(CurrentUser.getCurrentUser().getEmail());

        return repo.save(c);
    }
    public Coupon updateCoupon(Long id,  CouponDTO dto) {
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

    public OperationResponse deleteCoupon(@PathVariable Long id) {
        repo.deleteById(id);
        return new OperationResponse("Coupon deleted successfully !");
    }
}
