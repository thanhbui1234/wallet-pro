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
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Importing icons from react-icons/fa

const strategies = [
  {
    name: "10000WHY_USDT",
    bots: [
      {
        id: 1,
        name: "Meowwww",
        tradeType: "LONG",
        interval: "Min5",
        oc: "5.5%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
        active: false,
      },
      {
        id: 2,
        name: "BotX",
        tradeType: "SHORT",
        interval: "Min10",
        oc: "4.3%",
        amount: "200$",
        extend: "55%",
        tp: "25%",
        reduce: "4%",
        up: "4%",
        ignore: "8%",
        active: false,
      },
      {
        id: 3,
        name: "AlphaBot",
        interval: "Min15",
        oc: "6.1%",
        amount: "150$",
        extend: "70%",
        tp: "35%",
        reduce: "3%",
        up: "7%",
        ignore: "12%",
        active: false,
      },
      {
        id: 4,
        name: "OmegaBot",
        interval: "Min5",
        oc: "3.5%",
        amount: "120$",
        extend: "65%",
        tp: "40%",
        reduce: "2%",
        up: "6%",
        ignore: "15%",
        active: false,
      },
    ],
  },
  {
    name: "10000MUMU_USDT",
    bots: [
      {
        id: 5,
        name: "Meowwww",
        interval: "Min5",
        oc: "5.6%",
        amount: "100$",
        extend: "60%",
        tp: "30%",
        reduce: "5%",
        up: "5%",
        ignore: "10%",
        active: false,
      },
      {
        id: 6,
        name: "BotX",
        interval: "Min10",
        oc: "4.8%",
        amount: "250$",
        extend: "50%",
        tp: "28%",
        reduce: "6%",
        up: "4%",
        ignore: "9%",
        active: false,
      },
      {
        id: 7,
        name: "BetaBot",
        interval: "Min15",
        oc: "5.3%",
        amount: "200$",
        extend: "62%",
        tp: "33%",
        reduce: "5%",
        up: "6%",
        ignore: "11%",
        active: false,
      },
    ],
  },
];

const StrategyTable = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [expandedStrategies, setExpandedStrategies] = useState<{
    [key: string]: boolean;
  }>({});
  const [strategiesState, setStrategiesState] = useState(strategies); // Store strategies with their bot active states
  const [applyAllState, setApplyAllState] = useState<boolean>(false); // Track whether all bots are ON or OFF

  // Toggle the visibility of strategy bot rows
  const toggleStrategyVisibility = (strategyName: string) => {
    setExpandedStrategies((prev) => ({
      ...prev,
      [strategyName]: !prev[strategyName],
    }));
  };

  // Function to toggle all bots in all strategies to a specific state (On or Off)
  const applyAllBotsState = (state: boolean) => {
    setStrategiesState((prevStrategies) => {
      return prevStrategies.map((strategy) => ({
        ...strategy,
        bots: strategy.bots.map((bot) => ({
          ...bot,
          active: state, // Set all bots' active state to the desired value
        })),
      }));
    });
    setApplyAllState(state); // Set applyAllState to true or false
  };

  // Filter strategies based on selectedSymbol and selectedBot
  const filteredStrategies = strategiesState.filter((strategy) => {
    const matchesSymbol =
      selectedSymbol === "all" || selectedSymbol === ""
        ? true
        : strategy.name.includes(selectedSymbol);
    const matchesBot = selectedBot
      ? strategy.bots.some((bot) => bot.name.includes(selectedBot))
      : true;

    return matchesSymbol && matchesBot;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <Select onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Symbols</SelectItem>
              {strategies.map((strategy) => (
                <SelectItem key={strategy.name} value={strategy.name}>
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedBot}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Bot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bots</SelectItem>
              {strategies
                .flatMap((strategy) =>
                  strategy.bots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.name}>
                      {bot.name}
                    </SelectItem>
                  ))
                )
                .filter(
                  (bot, index, self) =>
                    index ===
                    self.findIndex((t) => t.props.value === bot.props.value)
                )}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            Reset
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyAllBotsState(!applyAllState)}
        >
          Apply All
        </Button>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Type</TableHead>
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
            {filteredStrategies.map((strategy) => (
              <React.Fragment key={strategy.name}>
                <TableRow
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleStrategyVisibility(strategy.name)}
                >
                  <TableCell colSpan={10}>
                    <div className="flex items-center gap-2">
                      {expandedStrategies[strategy.name] ? (
                        <FaChevronDown className="w-3 h-3" />
                      ) : (
                        <FaChevronRight className="w-3 h-3" />
                      )}
                      <span className="font-medium">{strategy.name}</span>
                    </div>
                  </TableCell>
                </TableRow>

                {expandedStrategies[strategy.name] &&
                  strategy.bots.map(
                    (bot) => (
                      console.log(bot),
                      (
                        <TableRow key={bot.id} className="hover:bg-muted/50">
                          <TableCell className="flex items-center gap-2">
                            <Switch
                              checked={bot.active}
                              onCheckedChange={() => {
                                setStrategiesState((prev) =>
                                  prev.map((s) => ({
                                    ...s,
                                    bots: s.bots.map((b) =>
                                      b.id === bot.id
                                        ? { ...b, active: !b.active }
                                        : b
                                    ),
                                  }))
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>{bot.name}</TableCell>
                          <TableCell>{bot?.tradeType}</TableCell>
                          <TableCell>{bot.interval}</TableCell>
                          <TableCell className="text-right">{bot.oc}</TableCell>
                          <TableCell className="text-right">
                            {bot.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            {bot.extend}
                          </TableCell>
                          <TableCell className="text-right">{bot.tp}</TableCell>
                          <TableCell className="text-right">
                            {bot.reduce}
                          </TableCell>
                          <TableCell className="text-right">{bot.up}</TableCell>
                          <TableCell className="text-right">
                            {bot.ignore}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default StrategyTable;
