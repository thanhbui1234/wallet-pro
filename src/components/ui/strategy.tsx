import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useState } from "react";

const strategies = [
  {
    name: "10000WHY_USDT",
    bots: [
      {
        id: 1,
        name: "Meowwww",
        interval: "Min5",
        oc: "5.5%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
      },
      {
        id: 2,
        name: "Meowwww",
        interval: "Min5",
        oc: "5.5%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
      },
    ],
  },
  {
    name: "10000MUMU_USDT",
    bots: [
      {
        id: 3,
        name: "Meowwww",
        interval: "Min5",
        oc: "5.6%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
      },
      {
        id: 4,
        name: "Meowwww",
        interval: "Min5",
        oc: "5.6%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
      },
    ],
  },
];

export default function StrategyTable() {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  console.log(selectedSymbol, selectedBot);

  return (
    <div className="space-y-4">
      {/* Bộ lọc */}
      <div className="flex gap-4 items-center">
        <Select onValueChange={setSelectedSymbol}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC_USDT">BTC_USDT</SelectItem>
            <SelectItem value="ETH_USDT">ETH_USDT</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedBot}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Bot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Meowwww">Meowwww</SelectItem>
            <SelectItem value="BotX">BotX</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">Reset</Button>
      </div>

      {/* Table */}
      <Card className="p-4 shadow-md border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Action</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Int</TableHead>
              <TableHead>OC</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Extend</TableHead>
              <TableHead>TP</TableHead>
              <TableHead>Reduce</TableHead>
              <TableHead>Up</TableHead>
              <TableHead>Ignore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((strategy) => (
              <>
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell colSpan={10}>{strategy.name}</TableCell>
                </TableRow>
                {strategy.bots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell>
                      <Switch />
                    </TableCell>
                    <TableCell>{bot.name}</TableCell>
                    <TableCell>{bot.interval}</TableCell>
                    <TableCell>{bot.oc}</TableCell>
                    <TableCell>{bot.amount}</TableCell>
                    <TableCell>{bot.extend}</TableCell>
                    <TableCell>{bot.tp}</TableCell>
                    <TableCell>{bot.reduce}</TableCell>
                    <TableCell>{bot.up}</TableCell>
                    <TableCell>{bot.ignore}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
