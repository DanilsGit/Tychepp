import axios from "axios";
import { supabase } from "./supabase";
import { env } from "../../env";

const API_URL = `${env.FUNCTIONS_URL}`;
// Crear una instancia de Axios (opcional, pero recomendable)
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token
api.interceptors.request.use(
  async (config) => {
    const session = (await supabase.auth.getSession()).data.session
    const token = session?.access_token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
