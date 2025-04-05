import { create } from "zustand";

interface UserState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUsers: (users: any[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => {
    set({ users });
  },
}));
