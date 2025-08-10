import axios from "axios";
import config from "../../config/config";

export const getAllCoupons = (token) => {
  return axios.get(`${config.base_url}/coupon`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCoupon = (coupon, token) => {
  return axios.patch(`${config.base_url}/coupon/${coupon.id}`, coupon, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cashCoupon = (couponId, token) => {
  return axios.get(`${config.base_url}/coupon/use-coupon/${couponId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
