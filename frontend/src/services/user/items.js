import axios from "axios";
import config from "../../config/config";

export function getAllItems(catererId, token) {
  return axios.get(`${config.base_url}/item/caterer/${catererId}`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
}

export function createItem(item, token) {
  return axios.post(`${config.base_url}/item`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateItem(item, token) {
  return axios.patch(`${config.base_url}/item/${item.id}`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteItem(itemId, token) {
  return axios.delete(`${config.base_url}/item/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
