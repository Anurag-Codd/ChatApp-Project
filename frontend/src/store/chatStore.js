import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utilities/axios.js";
import { authStore } from "./authStore.js";

const chatStore = create((set, get) => ({
  chats: [],
  users: [],
  isLoading: false,
  selectedUser: null,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/chat/users");
      set({ users: data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChats: async (uid) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/chat/${uid}`);
      set({ chats: data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, chats } = get();
    try {
      const { data } = await axiosInstance.post(
        `/chat/send/${selectedUser._id}`,
        messageData
      );
      set({ chats: [...chats, data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessage: () => {
    const socket = authStore.getState().socket;
    const { selectedUser, chats } = get();

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.sender._id === selectedUser._id ||
        newMessage.receiver._id === selectedUser._id
      ) {
        set({ chats: [...chats, newMessage] });
      }
      return;
    });
  },

  unsubscribeToMessage: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default chatStore;
