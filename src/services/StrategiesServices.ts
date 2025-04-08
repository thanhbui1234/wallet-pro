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

export const getStrategies = async () => {
  const response = await api.get("/strategy");
  return response.data;
};

export const createStrategy = async (strategyData: StrategyData) => {
  const response = await api.post("/strategy", strategyData);
  return response.data;
};

export const deleteStrategy = async (strategyIds: string[]) => {
  const response = await api.delete(`/strategy`, {
    data: {
      ids: strategyIds,
    },
  });
  return response.data;
};
