package com.cms.cms.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.exception.InvalidInputException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.dto.CouponType.CouponTypeDTO;
import com.cms.cms.models.dto.CouponType.NewCouponTypeDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.CouponType;
import com.cms.cms.repository.CatererRepository;
import com.cms.cms.repository.CouponTypeRepository;
import com.cms.cms.utils.CurrentUser;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CouponTypeService {
    public final CouponTypeRepository couponTypeRespository;
    public final CatererRepository catererRepo;

	public List<CouponType> getAllCouponTypes() {
		return couponTypeRespository.findAll();
	}

    public List<CouponType> getCouponTypesByCatererId(Long catererId) {
        return couponTypeRespository.findByCatererId(catererId);
    }

    public CouponType getCouponType(Long id){
        Optional<CouponType> ct = couponTypeRespository.findById(id);
        if(!ct.isPresent()) throw new CustomEntityNotFoundException("User with " + id + " not found");
        return ct.get();
    }

	public OperationResponse deleteCouponType(Long id) {
		couponTypeRespository.deleteById(id);
		return new OperationResponse("Coupon type deleted Successfully !");
	}

	public CouponType createCouponType(NewCouponTypeDTO type, BindingResult result) {
		// Check if caterer exist
		if (result.hasErrors()) {
			throw new InvalidInputException("CouponType", result);
		} else {
			Caterer caterer = catererRepo.findById(type.getCatererId())
					.orElseThrow(() -> new CustomEntityNotFoundException("Caterer"));
//        CouponType ct = mapper.map(type, CouponType.class);
			CouponType ct = new CouponType();
			ct.setMinCount(type.getMinCount());
			ct.setDiscountPerCoupon(type.getDiscountPerCoupon());
			ct.setType(type.getType());
			ct.setOriginalPrice(type.getOriginalPrice());
			ct.setCreatedBy(CurrentUser.getCurrentUser().getEmail());
			ct.setCaterer(caterer);
//        ct.setId(null);
			CouponType c1 = couponTypeRespository.save(ct);
			System.out.println(c1.getMinCount() + "**********");
			return c1;
		}
	}

	public CouponType updateCouponType(Long id, CouponTypeDTO dto) {
		Optional<CouponType> opt = couponTypeRespository.findById(id);
		if (!opt.isPresent())
			throw new CustomEntityNotFoundException("Coupon type");
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

			return couponTypeRespository.save(current);
		}
	}
}
