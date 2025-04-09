import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils.ts";
import { getPositons, quickClose } from "@/services/PositionsServices.ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { queryClient } from "@/lib/react-query.ts";

const PositionTable = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});

  const bots = typeof window !== "undefined" && sessionStorage.getItem("bots")
    ? JSON.parse(sessionStorage.getItem("bots")!)
    : [];

  const positionPayload = bots.map((bot: any) => ({
    botId: bot.id,
    botName: bot.name,
    u_id: bot.u_id,
    proxy: bot.proxy,
  }));

  const getPrice = async (u_id: string) => {
    try {
      const res = await axios.get(
        `/mexc/api/v1/contract/ticker`,
      );

      const prices: Record<string, number> = {};
      res.data.data.forEach((e: any) => {
        prices[e.symbol] = e.fairPrice;
      });

      return prices;
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      return {};
    }
  };

  const { data } = useQuery({
    queryKey: ["positions", positionPayload],
    queryFn: ({ queryKey }) => {
      const [_key, payload] = queryKey;
      return getPositons(positionPayload);
    },
    select: (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response || [];
    },
    refetchInterval: 3000,
  });
  const positions = Array.isArray(data) ? data : [];

  useEffect(() => {
    const fetchPrices = async () => {
      if (bots[0]?.u_id) {
        const priceData = await getPrice(bots[0].u_id);
        setPrices(priceData);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const calculatePNL = (s: any) => {
    const currentPrice = prices[s.symbol];
    if (!currentPrice) return "-";

    const base = s.holdAvgPrice;
    const im = s.im;
    const leverage = s.leverage;

    const pnl =
      s.positionType === 1
        ? (100000 * (currentPrice - base) * im * leverage) / base
        : (100000 * (base - currentPrice) * im * leverage) / base;

    return Math.round(pnl) / 100000;
  };

  const mutation = useMutation({
    mutationFn: quickClose,
    onSuccess: () => {
      console.log('Position closed successfully.');
    },
    onError: (error) => {
      console.error('Failed to close position:', error);
    },
  });

  const handleDelete = (pos) => {
    if (window.confirm(`Bạn chắc chắn muốn đóng lệnh ${pos.symbol}?`)) {
      const closePos = {
        symbol: pos.symbol,
        botId: pos.botId,
        vol: +pos.holdVol,
        positionType: +pos.positionType,
        leverage: +pos.leverage,
        positionId: +pos.positionId,
      };
      mutation.mutate(closePos);
    }
  };

  // const handleDelete = (pos: {
  //   symbol: string;
  //   botId: string;
  //   holdVol: number;
  //   positionType: number;
  //   leverage: number;
  //   positionId: string;
  // }) => {
  //   if (window.confirm(`Bạn chắc chắn muốn đóng lệnh ${pos.symbol}?`)) {
  //     const closePos = {
  //       symbol: pos.symbol,
  //       botId: pos.botId,
  //       vol: +pos.holdVol,
  //       positionType: +pos.positionType,
  //       leverage: +pos.leverage,
  //       positionId: +pos.positionId,
  //     };

  //     useQuery({
  //       queryKey: ['positions', closePos],
  //       queryFn: () => quickClose(closePos),
  //       enabled: Boolean(closePos), // Chỉ thực hiện truy vấn nếu closePos hợp lệ
  //       select: (response) => {
  //         if (response && response.data) {
  //           console.log(888888, response);

  //           return response.data;
  //         }
  //         return [];
  //       },
  //     });
  //   }
  // };

  return (
    <div className="border rounded-xl shadow-md p-4 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600">
            <TableHead>Symbol</TableHead>
            <TableHead>Bot Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>PNL</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-xl">📄</span>
                  <span className="text-gray-500">No data</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            positions.map((pos: any, index: number) => (
              <TableRow key={index} className="border-b hover:bg-gray-50">
                <TableCell>{pos.symbol}</TableCell>
                <TableCell>{pos.botName}</TableCell>
                <TableCell
                  className={cn(
                    "font-medium",
                    pos.positionType === 1 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {pos.positionType === 1 ? "Long" : "Short"}
                </TableCell>
                <TableCell>
                  {Math.round(pos.im * pos.leverage * 100000) / 100000}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium",
                    +calculatePNL(pos) < 0 ? "text-red-500" : "text-green-500"
                  )}
                >
                  {calculatePNL(pos)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(pos)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PositionTable;