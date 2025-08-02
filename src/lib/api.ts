import axios from "axios";
import { supabase } from "./supabase";
import { env } from "../../env";

const API_URL = `${env.FUNCTIONS_URL}`;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token
api.interceptors.request.use(
  async (config) => {
    const session = (await supabase.auth.getSession()).data.session;
    // const token = session?.access_token;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
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
