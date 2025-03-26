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
import { Edit, Trash2 } from "lucide-react";

const positions = [
  {
    symbol: "BTC/USDT",
    botName: "Meowwww",
    type: "Long",
    volume: "0.5 BTC",
    pnl: "+5%",
  },
  {
    symbol: "ETH/USDT",
    botName: "PurrfectBot",
    type: "Short",
    volume: "10 ETH",
    pnl: "-3%",
  },
];

export default function PositionTable() {
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
            positions.map((pos, index) => (
              <TableRow key={index} className="border-b hover:bg-gray-50">
                <TableCell>{pos.symbol}</TableCell>
                <TableCell>{pos.botName}</TableCell>
                <TableCell>{pos.type}</TableCell>
                <TableCell>{pos.volume}</TableCell>
                <TableCell
                  className={cn(
                    "font-medium",
                    pos.pnl.includes("+") ? "text-green-500" : "text-red-500"
                  )}
                >
                  {pos.pnl}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost">
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button size="icon" variant="ghost">
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
}
