import { api } from "@/core/api.ts";

interface StrategyData {
  symbol: string;
  botId: string;
  int: number;
  tradeType: "BOTH" | "LONG" | "SHORT";
  oc: number;
  amount: number;
  extend: number;
  takeProfit: number;
  reduceTp: number;
  upReduce: number;
  ignore: number;
  ps: number;
  cs: number;
}

export interface StrategyResponse {
  id: string;
  symbol: string;
  botId: string;
  botName: string;
  tradeType: string;
  int: number;
  oc: number;
  ps: number;
  extend: number;
  amount: number;
  takeProfit: number;
  reduceTp: number;
  upReduce: number;
  ignore: number;
  cs: number;
  isActive: boolean;
}

export const getStrategies = async () => {
  const response = await api.get("/strategy");
  console.log("response", response);

  // Return the data directly since api.get already returns response.data
  return response;
};

export const createStrategy = async (strategyData: StrategyData) => {
  const response = await api.post("/strategy", strategyData);
  return response;
};

export const deleteStrategy = async (strategyIds: string[]) => {
  const response = await api.delete(`/strategy`, {
    data: {
      ids: strategyIds,
    },
  });
  return response;
};

export const updateStrategy = async (strategyData: {
  id: string;
  int?: number;
  tradeType?: "BOTH" | "LONG" | "SHORT";
  oc?: number;
  amount?: number;
  extend?: number;
  takeProfit?: number;
  reduceTp?: number;
  upReduce?: number;
  ignore?: number;
  ps?: number;
  cs?: number;
  isActive?: boolean;
}) => {
  const response = await api.patch("/strategy", strategyData);
  return response;
};
