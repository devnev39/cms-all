import axios from "axios";
import config from "../../config/config";

export const createOrder = (cart, token) => {
  return axios.post(`${config.base_url}/order/create-payment`, cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const verifyPayment = (data, token) => {
  console.log(data);
  return axios.post(`${config.base_url}/order/verify-payment`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const createOrderCoupon = (cart, token) => {
//   return axios.post(`${config.base_url}/order`, cart, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const updateOrder = (order, token) => {
  return axios.patch(`${config.base_url}/order/${order.id}`, order, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllOrders = (token) => {
  return axios.get(`${config.base_url}/order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const getAllCatererOrders = (token) => {
//   return axios.get(`${config.base_url}/order/caterer`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
