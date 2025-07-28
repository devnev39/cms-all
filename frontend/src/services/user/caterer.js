import axios from "axios";
import config from "../../config/config";

export function getAllCagterers(token) {
  return axios.get(`${config.base_url}/caterer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createCaterer(caterer, token) {
  return axios.post(`${config.base_url}/caterer`, caterer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateCaterer(catererId, catererData, token) {
  return axios.patch(`${config.base_url}/caterer/${catererId}`, catererData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteCaterer(catererId, token) {
  return axios.delete(`${config.base_url}/caterer/${catererId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
