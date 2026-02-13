import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "../services/api";

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.adminLogin(credentials);
          const { token, ...admin } = response.data.data;

          localStorage.setItem("adminToken", token);

          set({
            admin,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem("adminToken");
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const response = await api.getAdminProfile();
          set({ admin: response.data.data, isAuthenticated: true });
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "fatwave-auth",
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Rooms Store
export const useRoomsStore = create((set, get) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  filters: {
    category: "",
    guests: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  clearFilters: () =>
    set({
      filters: {
        category: "",
        guests: "",
        minPrice: "",
        maxPrice: "",
        search: "",
      },
    }),

  fetchRooms: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getRooms(params);
      set({ rooms: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch rooms",
        isLoading: false,
      });
    }
  },

  fetchRoomBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getRoomBySlug(slug);
      set({ selectedRoom: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Room not found",
        isLoading: false,
      });
      return null;
    }
  },

  checkAvailability: async (slug, checkIn, checkOut) => {
    try {
      const response = await api.checkRoomAvailability(slug, checkIn, checkOut);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to check availability",
      );
    }
  },

  clearSelectedRoom: () => set({ selectedRoom: null }),
}));

// Booking Store
export const useBookingStore = create((set, get) => ({
  currentBooking: null,
  bookingDetails: {
    checkIn: null,
    checkOut: null,
    guests: 1,
    guestName: "",
    guestEmail: "",
    specialRequests: "",
  },
  isLoading: false,
  error: null,

  setBookingDetails: (details) =>
    set({
      bookingDetails: { ...get().bookingDetails, ...details },
    }),

  clearBookingDetails: () =>
    set({
      bookingDetails: {
        checkIn: null,
        checkOut: null,
        guests: 1,
        guestName: "",
        guestEmail: "",
        specialRequests: "",
      },
    }),

  createBooking: async (roomId) => {
    set({ isLoading: true, error: null });
    const details = get().bookingDetails;

    // Convert dates to ISO strings if they're Date objects
    const payload = {
      roomId,
      guestName: details.guestName,
      guestEmail: details.guestEmail,
      checkIn:
        details.checkIn instanceof Date
          ? details.checkIn.toISOString()
          : details.checkIn,
      checkOut:
        details.checkOut instanceof Date
          ? details.checkOut.toISOString()
          : details.checkOut,
      guests: details.guests,
      specialRequests: details.specialRequests || "",
    };

    console.log("Creating booking with payload:", payload);

    try {
      const response = await api.createBooking(payload);

      set({ currentBooking: response.data.data, isLoading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || "Booking failed";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchBooking: async (bookingReference) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getBookingByReference(bookingReference);
      set({ currentBooking: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Booking not found",
        isLoading: false,
      });
      return null;
    }
  },

  sendReceipt: async (bookingReference) => {
    try {
      await api.sendReceiptEmail(bookingReference);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send receipt",
      };
    }
  },

  downloadReceipt: async (bookingReference) => {
    try {
      const response = await api.downloadReceipt(bookingReference);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Fatwave_Reservation_${bookingReference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to download receipt",
      };
    }
  },

  confirmBookingWithCode: async (verificationCode, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.confirmBookingWithCode(
        verificationCode,
        email,
      );
      set({ currentBooking: response.data.data, isLoading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to confirm booking";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),
  clearBooking: () => set({ currentBooking: null }),
}));

// Admin Store
export const useAdminStore = create((set) => ({
  dashboardStats: null,
  rooms: [],
  bookings: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDashboardStats();
      set({ dashboardStats: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch dashboard",
        isLoading: false,
      });
    }
  },

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getAdminRooms();
      set({ rooms: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch rooms",
        isLoading: false,
      });
    }
  },

  createRoom: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.createRoom(data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create room";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateRoom: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateRoom(id, data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update room";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  deleteRoom: async (id) => {
    try {
      await api.deleteRoom(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete room",
      };
    }
  },

  updateDiscount: async (id, data) => {
    try {
      await api.updateRoomDiscount(id, data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update discount",
      };
    }
  },

  fetchBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getAdminBookings(params);
      set({
        bookings: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  },

  clearError: () => set({ error: null }),
}));

// Chat Store - For Live Support
export const useChatStore = create(
  persist(
    (set) => ({
      isLoaded: false,
      hasAutoOpened: false,

      setLoaded: (loaded) => set({ isLoaded: loaded }),
      setAutoOpened: (opened) => set({ hasAutoOpened: opened }),

      resetChat: () => set({ isLoaded: false, hasAutoOpened: false }),
    }),
    {
      name: "fatwave-chat-storage",
    },
  ),
);
