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
import com.cms.cms.models.common.Roles;
import com.cms.cms.models.dto.Coupon.CouponDTO;
import com.cms.cms.models.dto.Coupon.NewCouponDTO;
import com.cms.cms.models.entity.Coupon;
import com.cms.cms.service.CatererService;
import com.cms.cms.service.CouponService;
import com.cms.cms.utils.CurrentUser;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/coupon")
@CrossOrigin(origins = {"*"})
@AllArgsConstructor
public class CouponController {
    private final CouponService couponService;
    private final CatererService catererService;

    @GetMapping("")
    public List<Coupon> getAllCoupons() {
        if (CurrentUser.getCurrentAuthentication() == null) {
            throw new JwtException("Unathorized !");
        }

        Long userId = CurrentUser.getCurrentUserId();

        if (CurrentUser.hasRole(Roles.ROLE_CLNT)) {
            Long catererId = catererService.getCatererByClientId(userId).getId();
            return couponService.getCouponsByCatererId(catererId);
        } else if (CurrentUser.hasRole(Roles.ROLE_CSTMR)) {
            return couponService.getCouponsByCustomerId(userId);
        }
        return List.of();
    }

    @GetMapping("/use-coupon/{id}")
    public Coupon useCoupon(@PathVariable Long id) {
        return couponService.useCoupon(id);
    }


    @GetMapping("/{id}")
    public Coupon getCouponById(@PathVariable Long id) {
        return couponService.getCouponById(id);
    }

    @PostMapping("")
    public Coupon createCoupon(@Valid @RequestBody NewCouponDTO coupon,
            BindingResult bindingResult) {

        // check coupon is valid or not
        if (bindingResult.hasErrors()) {
            throw new InvalidInputException("Coupon", bindingResult);
        }

        return couponService.createCoupon(coupon);
    }

    @PatchMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody CouponDTO dto) { // no need to
                                                                                    // Validate
                                                                                    // couponDTO as
                                                                                    // fields are
                                                                                    // optional
        return couponService.updateCoupon(id, dto);
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteCoupon(@PathVariable Long id) {
        return couponService.deleteCoupon(id);
    }
}
