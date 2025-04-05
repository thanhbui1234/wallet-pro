import { api } from "@/core/api.ts";

interface BotData {
  name: string;
  u_id: string;
  accessKey: string;
  secretKey: string;
  proxy: string;
  telegramId?: number;
}

export const createBot = async (botData: BotData) => {
  const response = await api.post("/bot", botData);
  return response.data;
};

export const getBots = async () => {
  const response = await api.get("/bot");
  return response.data;
};

export const deleteBot = async (botId: string) => {
  const response = await api.delete(`/bots/${botId}`);
  return response.data;
};

export const updateBot = async (botData: Partial<BotData>) => {
  console.log(botData, "botData");
  const response = await api.patch(`/bot`, botData);
  return response.data;
};

export const changeBotStatus = async (botId: string, isActive: boolean) => {
  const statusValue = isActive ? 1 : 0;
  const response = await api.patch(`/bot/status`, {
    status: statusValue,
    botId: botId,
  });
  return response.data;
};
