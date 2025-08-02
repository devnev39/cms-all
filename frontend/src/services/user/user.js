import axios from "axios";
import config from "../../config/config";

export function createUser(user) {
  return axios.post(`${config.base_url}/user`, user);
}

export function getCurrentUser(token) {
  return axios.get(`${config.base_url}/user/self`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAllUsers(token) {
  return axios.get(`${config.base_url}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateUser(userId, userData, token) {
  return axios.patch(`${config.base_url}/user/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteUser(userId, token) {
  return axios.delete(`${config.base_url}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
