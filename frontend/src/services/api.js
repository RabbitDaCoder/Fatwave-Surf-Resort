import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (
        window.location.pathname.startsWith("/owner") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/owner/login";
      }
    }
    return Promise.reject(error);
  },
);

// ============ PUBLIC API ============

// Rooms
export const getRooms = (params) => api.get("/rooms", { params });
export const getRoomBySlug = (slug) => api.get(`/rooms/${slug}`);
export const checkRoomAvailability = (slug, checkIn, checkOut) =>
  api.get(`/rooms/${slug}/availability`, { params: { checkIn, checkOut } });

// Bookings
export const createBooking = (data) => api.post("/bookings", data);
export const confirmBookingWithCode = (verificationCode, email) =>
  api.post("/bookings/confirm", { verificationCode, email });
export const getBookingByReference = (bookingReference) =>
  api.get(`/bookings/${bookingReference}`);
export const sendReceiptEmail = (bookingReference) =>
  api.post("/bookings/send-receipt", { bookingReference });
export const downloadReceipt = (bookingReference) =>
  api.get(`/bookings/${bookingReference}/receipt`, { responseType: "blob" });

// ============ AUTH API ============

export const adminLogin = (credentials) => api.post("/auth/login", credentials);
export const getAdminProfile = () => api.get("/auth/me");

// ============ OWNER API ============

// Dashboard
export const getDashboardStats = () => api.get("/owner/dashboard");

// Owner Rooms
export const getAdminRooms = () => api.get("/owner/rooms");
export const createRoom = (data) => api.post("/owner/rooms", data);
export const updateRoom = (id, data) => api.put(`/owner/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/owner/rooms/${id}`);
export const updateRoomDiscount = (id, data) =>
  api.put(`/owner/rooms/${id}/discount`, data);

// Owner Bookings
export const getAdminBookings = (params) =>
  api.get("/owner/bookings", { params });
export const updateBookingStatus = (id, status) =>
  api.put(`/owner/bookings/${id}/status`, { status });
export const getAdminBookingById = (id) => api.get(`/owner/bookings/${id}`);
export const getVerificationCode = (id) =>
  api.get(`/owner/bookings/${id}/verification-code`);

export default api;
