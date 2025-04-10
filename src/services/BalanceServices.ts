import { apiBackup } from "@/core/api-backup.ts";
import { toast } from "sonner";

interface BalanceData {
  botId: string;
  botName: string;
  proxy: string;
  u_id: string;
  accessKey: string;
  secretKey: string
}

export const getBalances = async (data: BalanceData[]) => {
  const response = await apiBackup.post("/user/usdt", data);
  return response.data;
};
