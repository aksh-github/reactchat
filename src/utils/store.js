import create from "zustand";

const useStore = create((set) => ({
  message: "",
  messages: [],
  user: "",
  room: "",
  publicKey: null,
  isConnected: false,
  setMessage: (newMsg) =>
    set((state) => ({
      ...state,
      message: newMsg,
    })),

  setMessages: (arr) =>
    set((state) => ({
      ...state,
      messages: arr,
    })),

  setUser: (user) =>
    set((state) => ({
      ...state,
      user: user,
    })),

  setRoom: (room) =>
    set((state) => ({
      ...state,
      room: room,
    })),
  setPublickey: (pk) =>
    set((state) => ({
      ...state,
      publicKey: pk,
    })),
  setIsConnected: (nf) => {
    set((state) => ({
      ...state,
      isConnected: nf,
    }));
  },
}));

export default useStore;
