/* eslint-disable @typescript-eslint/no-explicit-any */
import { showCustomToast } from "@/components/ui/toats.tsx";
import { create } from "zustand";

export interface Bot {
  id?: string;
  name: string;
  u_id: string;
  accessKey: string;
  secretKey: string;
  proxy: string;
  telegramId?: number;
  status: any;
}

interface BotState {
  isDialogOpen: boolean;
  selectedBot: Bot | null;
  isEditing: boolean;

  // UI Actions
  openDialog: () => void;
  closeDialog: () => void;
  selectBot: (bot: Bot | null) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const useBotStore = create<BotState>((set) => ({
  isDialogOpen: false,
  selectedBot: null,
  isEditing: false,

  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () =>
    set({ isDialogOpen: false, selectedBot: null, isEditing: false }),
  selectBot: (bot: Bot | null) =>
    set({ selectedBot: bot, isEditing: !!bot, isDialogOpen: true }),
  setIsEditing: (isEditing: boolean) => set({ isEditing }),
}));

// Toast helper functions to use with React Query
export const showSuccessToast = (message: string) => {
  showCustomToast({
    type: "success",
    message,
  });
};

export const showErrorToast = (error: any) => {
  showCustomToast({
    type: "error",
    message: error?.response?.data?.message || "Operation failed",
  });
};
