import { apiBackup } from "@/core/api-backup.ts";
import { toast } from "sonner";

interface PositionData {
  botId: string;
  botName: string;
  proxy: string;
  u_id: string;
}
interface QuickCloseData {
  symbol: string;
  botId: string;
  vol: number;
  positionType: number;
  leverage: number;
  positionId: number;
}

export const getPositons = async (data: PositionData[]) => {
  const response = await apiBackup.post("/user/pos", data);
  const errorBots = response?.data?.errorBots
  if (!!Array.isArray(errorBots) && errorBots.length > 0) {
    errorBots.map((botName) => toast.error(`${botName} uid expired or proxy error`));
  }
  return response.data?.positions;
};

export const quickClose = async (data: QuickCloseData) => {
  const response = await apiBackup.post("/mexc/quick-close", data);  
  return response.data;
};
