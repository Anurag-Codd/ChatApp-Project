import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utilities/axiosInstance";
import { authStore } from "./authStore";

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
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
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
    const { selectedUser } = get();

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set((state) => ({ chats: [...state.chats, newMessage] }));
      }
    });
  },

  unsubscribeToMessage: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default chatStore;
