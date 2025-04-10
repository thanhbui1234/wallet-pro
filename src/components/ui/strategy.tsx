import StrategyForm from "@/components/Strategy/StrategyForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import DialogCustom from "@/components/ui/dialogCustom.tsx";
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
import {
  deleteStrategy,
  getStrategies,
} from "@/services/StrategiesServices.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";

// Define the strategy item interface based on the API response
interface StrategyItem {
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

// Define the grouped strategy interface
interface GroupedStrategy {
  name: string; // symbol name
  bots: StrategyItem[];
}

const StrategyTable = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [expandedStrategies, setExpandedStrategies] = useState<{
    [key: string]: boolean;
  }>({});
  const [strategiesState, setStrategiesState] = useState<GroupedStrategy[]>([]);
  const [applyAllState, setApplyAllState] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<StrategyItem | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [symbolsList, setSymbolsList] = useState<string[]>([]);

  // Fetch strategies data using React Query
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
  });

  // Add delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStrategy([id]),
    onSuccess: () => {
      toast.success("Strategy deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete strategy: ${error}`);
    },
  });

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await axios.get(`/mexc/api/v1/contract/ticker`);
        const filtered = res.data.data
          .map((item: any) => item.symbol)
        setSymbolsList(filtered);
      } catch (error) {
        console.error("Failed to fetch symbols:", error);
      }
    };

    fetchSymbols();
  }, []);

  // Group strategies by symbol when API data is loaded
  useEffect(() => {
    console.log("API Response:", apiResponse);

    if (apiResponse && apiResponse.data) {
      const strategies = apiResponse.data;

      // Group strategies by symbol
      const groupedStrategies: { [key: string]: StrategyItem[] } = {};

      strategies.forEach((strategy: StrategyItem) => {
        if (!groupedStrategies[strategy.symbol]) {
          groupedStrategies[strategy.symbol] = [];
        }
        groupedStrategies[strategy.symbol].push(strategy);
      });

      // Convert to array format needed for the component
      const formattedStrategies: GroupedStrategy[] = Object.keys(
        groupedStrategies
      ).map((symbol) => ({
        name: symbol,
        bots: groupedStrategies[symbol],
      }));

      console.log("Formatted Strategies:", formattedStrategies);
      setStrategiesState(formattedStrategies);
    }
  }, [apiResponse]);

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
          isActive: state,
        })),
      }));
    });
    setApplyAllState(state);
  };

  // Filter strategies based on selectedSymbol and selectedBot
  const filteredStrategies = strategiesState.filter((strategy) => {
    const matchesSymbol =
      selectedSymbol === "all" || selectedSymbol === ""
        ? true
        : strategy.name.includes(selectedSymbol);
    const matchesBot = selectedBot
      ? strategy.bots.some((bot) => bot.botName.includes(selectedBot))
      : true;

    return matchesSymbol && matchesBot;
  });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleStrategyAdded = () => {
    refetch();
    closeDialog();
  };

  const openEditDialog = (strategy: StrategyItem) => {
    setEditingStrategy(strategy);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingStrategy(null);
    setIsEditDialogOpen(false);
  };

  // Add these new states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<string | null>(null);

  // Replace the handleDeleteStrategy function
  const handleDeleteStrategy = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStrategyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Add this function to confirm deletion
  const confirmDelete = () => {
    if (strategyToDelete) {
      deleteMutation.mutate(strategyToDelete);
      setDeleteConfirmOpen(false);
      setStrategyToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Strategies</h1>
        <Button onClick={openDialog}>+ Add Strategy</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading strategies...</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <Select onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Symbols</SelectItem>
                  {strategiesState.map((strategy) => (
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
                  {strategiesState
                    .flatMap((strategy) =>
                      strategy.bots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.botName}>
                          {bot.botName}
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
                  <TableHead className="w-[120px]">Actions</TableHead>
                  <TableHead className="w-[180px]">Bot</TableHead>
                  <TableHead className="w-[60px] text-center">Type</TableHead>
                  <TableHead className="w-[60px] text-center">Int</TableHead>
                  <TableHead className="w-[80px] text-right">OC</TableHead>
                  <TableHead className="w-[100px] text-right">Amount</TableHead>
                  <TableHead className="w-[80px] text-right">Extend</TableHead>
                  <TableHead className="w-[80px] text-right">TP</TableHead>
                  <TableHead className="w-[80px] text-right">Reduce</TableHead>
                  <TableHead className="w-[60px] text-right">Up</TableHead>
                  <TableHead className="w-[80px] text-right">Ignore</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStrategies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No strategies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStrategies.map((strategy) => (
                    <React.Fragment key={strategy.name}>
                      <TableRow
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleStrategyVisibility(strategy.name)}
                      >
                        <TableCell colSpan={11}>
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
                        strategy.bots.map((bot) => (
                          <TableRow key={bot.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center justify-start gap-2">
                                <Switch
                                  checked={bot.isActive}
                                  onCheckedChange={() => {
                                    setStrategiesState((prev) =>
                                      prev.map((s) => ({
                                        ...s,
                                        bots: s.bots.map((b) =>
                                          b.id === bot.id
                                            ? { ...b, isActive: !b.isActive }
                                            : b
                                        ),
                                      }))
                                    );
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(bot);
                                  }}
                                >
                                  <FaEdit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    handleDeleteStrategy(bot.id, e);
                                  }}
                                >
                                  <FaTrash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{bot.botName}</TableCell>
                            <TableCell className="text-center">
                              {bot.tradeType === "LONG" ? (
                                <FaArrowUp className="text-green-500 mx-auto" />
                              ) : bot.tradeType === "SHORT" ? (
                                <FaArrowDown className="text-red-500 mx-auto" />
                              ) : (
                                bot.tradeType
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              Min {bot.int}
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.oc}%
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.amount}$
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.extend}%
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.takeProfit}%
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.reduceTp}%
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.upReduce}%
                            </TableCell>
                            <TableCell className="text-right">
                              {bot.ignore}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <DialogCustom open={isDialogOpen} onOpenChange={closeDialog}>
        <StrategyForm onSuccess={handleStrategyAdded} symbolsList={symbolsList} />
      </DialogCustom>

      <DialogCustom open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        {editingStrategy && (
          <StrategyForm
            strategy={{
              ...editingStrategy,
              tradeType: editingStrategy.tradeType as "LONG" | "SHORT" | "BOTH",
            }}
            isEditing={true}
            onSuccess={() => {
              refetch();
              closeEditDialog();
            }}
            symbolsList={symbolsList}
          />
        )}
      </DialogCustom>
      {/* Add the delete confirmation dialog */}
      <DialogCustom
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <div className="p-6 space-y-6">
          <h3 className="text-xl font-semibold">Confirm Deletion</h3>
          <p className="text-muted-foreground">
            Are you sure you want to delete this strategy? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogCustom>
    </div>
  );
};

export default StrategyTable;
