/* eslint-disable @typescript-eslint/no-explicit-any */
import { showCustomToast } from "@/components/ui/toats.tsx";
import { create } from "zustand";

export interface Bot {
  id: number;
  name: string;
  tradeType?: string;
  interval: string;
  oc: string;
  amount: string;
  extend: string;
  tp: string;
  reduce: string;
  up: string;
  ignore: string;
  active: boolean;
}

export interface Strategy {
  name: string;
  bots: Bot[];
}

interface StrategyState {
  isDialogOpen: boolean;
  selectedStrategy: Strategy | null;
  isEditing: boolean;
  strategies: Strategy[];

  // UI Actions
  openDialog: () => void;
  closeDialog: () => void;
  selectStrategy: (strategy: Strategy | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  setStrategies: (strategies: Strategy[]) => void;
}

export const useStrategyStore = create<StrategyState>((set) => ({
  isDialogOpen: false,
  selectedStrategy: null,
  isEditing: false,
  strategies: [],

  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () =>
    set({ isDialogOpen: false, selectedStrategy: null, isEditing: false }),
  selectStrategy: (strategy: Strategy | null) =>
    set({
      selectedStrategy: strategy,
      isEditing: !!strategy,
      isDialogOpen: true,
    }),
  setIsEditing: (isEditing: boolean) => set({ isEditing }),
  setStrategies: (strategies: Strategy[]) => set({ strategies }),
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
