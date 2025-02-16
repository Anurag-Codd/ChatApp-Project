import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axiosInstance from "../utilities/axios";
import {
  auth,
  createUser,
  signInUser,
  signOutUser,
  monitorAuthState,
} from "../utilities/firebaseConfig";

const BASE_URL = "http://localhost:4555";

export const authStore = create((set, get) => ({
  socket: null,
  user: null,
  isLoading: false,
  onlineUsers: [],
  isAuthorized: false,
  isCheckingAuth: true,

  initializeAuth: () => {
    monitorAuthState(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        try {
          const { data } = await axiosInstance.get("/auth/authenticate-user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ user: data, isAuthorized: true });
          get().connectSocket();
        } catch (error) {
          console.error("Error fetching authenticated user data:", error);
          set({ user: null, isAuthorized: false });
        }
      } else {
        set({ user: null, isAuthorized: false });
      }
      set({ isCheckingAuth: false });
    });
  },
  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const userCredentials = await createUser(
        auth,
        formData.email,
        formData.password
      );
      const userData = {
        uid: userCredentials.user.uid,
        email: formData.email,
        fullName: formData.fullName,
      };

      const { data } = await axiosInstance.post("/auth/signup", userData);
      set({ user: data, isAuthorized: true });
      toast.success(data.message);

      get().connectSocket();
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (formData) => {
    set({ isLoading: true });
    try {
      const userCredentials = await signInUser(
        auth,
        formData.email,
        formData.password
      );
      const userData = { uid: userCredentials.user.uid };

      const { data } = await axiosInstance.post("/auth/login", userData);
      set({ user: data.user, isAuthorized: true });
      toast.success(data.message);

      get().connectSocket();
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOutUser(auth);
      set({ user: null, isAuthorized: false });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.put(
        "/auth/update-profile",
        profileData
      );
      set({ user: data });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (status) => {
    set({ isLoading: true });
    try {
      const { data } = axiosInstance.put("/auth/update-status", status);
      set({ user: data });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  connectSocket: () => {
    const { user, socket } = get();
    if (!user || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },
}));
