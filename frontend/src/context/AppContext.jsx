import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

let hasExpiredToast = false;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const clearSession = () => {
    setUser(null);
    hasExpiredToast = false;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        const payload = data?.data ?? data;
        const currentUser = payload?.user ?? data?.user;

        if (currentUser) {
          setUser(currentUser);
        }
      } catch {
        clearSession();
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401) {
          if (!hasExpiredToast) {
            toast.error("Your session has expired. Please login again.");
            hasExpiredToast = true;
          }
          clearSession();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post("/api/user/logout");
    } catch {}
    clearSession();
    navigate("/login");
  };

  const value = { navigate, axios, logout, user, setUser, authLoading, clearSession };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);