import axios from "axios";
import config from "../../config/config";

export function login({ email, password }) {
  return axios.post(`${config.base_url}/auth`, { email, password });
}
