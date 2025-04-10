import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { getBalances } from "@/services/BalanceServices.ts";
import React, { useEffect, useState } from "react";

const BalanceDetails = ({ balances }: { balances: any[] }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 inline-block bg-white shadow-lg rounded-xl p-4 z-50">
      {balances.map((bot, index) => (
        <div key={index} className="mb-3 last:mb-0 whitespace-nowrap">
          <div className="flex justify-between text-sm font-semibold text-gray-700">
            <span className="text-green-500">-</span>
            <span className="px-2">{bot.botName}</span>
            <span className="text-green-500">────────</span>
          </div>
          <div className="text-sm ml-4">
            Spot: <span className="font-medium">${bot.spot.toFixed(2)}</span>{' '}
            Future: <span className="font-semibold text-green-600">${bot.future.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Balance = () => {
  const [balances, setBalances] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Fetch bots & balances every 3 seconds
  useEffect(() => {
    const fetchBalances = async () => {
      const botsRaw = sessionStorage.getItem("bots");
      if (!botsRaw) {
        setBalances([]);
        setTotalBalance(0);
        return;
      }

      const bots = JSON.parse(botsRaw);
      if (!bots.length) return;
      const payload = bots.map((bot: any) => ({
        botId: bot.id,
        botName: bot.name,
        u_id: bot.u_id,
        proxy: bot.proxy,
        accessKey: bot.accessKey,
        secretKey: bot.secretKey,
      }));

      try {
        const response = await getBalances(payload);
        const balances = response?.balances || [];
        const totalBalance = !!response?.totalBalance ? response.totalBalance : 0
        setBalances(balances);
        setTotalBalance(totalBalance);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances(); // initial call
    const interval = setInterval(fetchBalances, 3000); // repeat every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative inline-block text-xl font-bold cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      💵 ${totalBalance.toFixed(2)}
      {isHovering && balances.length > 0 && <BalanceDetails balances={balances} />}
    </div>
  );
};

export default Balance;
