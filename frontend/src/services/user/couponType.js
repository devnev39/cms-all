import axios from "axios";
import config from "../../config/config";

// Get all coupon types
export function getAllCouponTypes(token) {
  return axios.get(`${config.base_url}/coupon_type`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Create a new coupon type
export function createCouponType(couponType, token) {
  return axios.post(`${config.base_url}/coupon_type`, couponType, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Update an existing coupon type
export function updateCouponType(couponType, token) {
  return axios.patch(`${config.base_url}/coupon_type/${couponType.id}`, couponType, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Delete a coupon type
export function deleteCouponType(id, token) {
  return axios.delete(`${config.base_url}/coupon_type/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
