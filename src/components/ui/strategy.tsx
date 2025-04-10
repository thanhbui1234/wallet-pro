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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = res.data.data.map((item: any) => item.symbol);
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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Strategies</h1>
        <Button onClick={openDialog} size="sm" className="text-xs py-1 px-2">
          + Add Strategy
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-3 text-sm">Loading strategies...</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <div className="flex flex-wrap gap-2 items-center">
              <Select onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Symbol" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">All Symbols</SelectItem>
                  {strategiesState.map((strategy) => (
                    <SelectItem key={strategy.name} value={strategy.name}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedBot}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Bot" />
                </SelectTrigger>
                <SelectContent className="text-xs">
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

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs py-1 px-2"
              >
                Reset
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyAllBotsState(!applyAllState)}
              className="h-8 text-xs py-1 px-2"
            >
              Apply All
            </Button>
          </div>

          <Card className="p-2">
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px] py-2">Actions</TableHead>
                    <TableHead className="w-[140px] py-2">Bot</TableHead>
                    <TableHead className="w-[40px] text-center py-2">
                      Type
                    </TableHead>
                    <TableHead className="w-[40px] text-center py-2">
                      Int
                    </TableHead>
                    <TableHead className="w-[50px] text-right py-2">
                      OC
                    </TableHead>
                    <TableHead className="w-[60px] text-right py-2">
                      Amount
                    </TableHead>
                    <TableHead className="w-[50px] text-right py-2">
                      Extend
                    </TableHead>
                    <TableHead className="w-[40px] text-right py-2">
                      TP
                    </TableHead>
                    <TableHead className="w-[50px] text-right py-2">
                      Reduce
                    </TableHead>
                    <TableHead className="w-[40px] text-right py-2">
                      Up
                    </TableHead>
                    <TableHead className="w-[50px] text-right py-2">
                      Ignore
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-3 text-xs"
                      >
                        No strategies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStrategies.map((strategy) => (
                      <React.Fragment key={strategy.name}>
                        <TableRow
                          className="hover:bg-muted/50 cursor-pointer"
                          onClick={() =>
                            toggleStrategyVisibility(strategy.name)
                          }
                        >
                          <TableCell colSpan={11} className="py-2">
                            <div className="flex items-center gap-1">
                              {expandedStrategies[strategy.name] ? (
                                <FaChevronDown className="w-2 h-2" />
                              ) : (
                                <FaChevronRight className="w-2 h-2" />
                              )}
                              <span className="font-medium text-xs">
                                {strategy.name}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>

                        {expandedStrategies[strategy.name] &&
                          strategy.bots.map((bot) => (
                            <TableRow
                              key={bot.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="py-1">
                                <div className="flex items-center justify-start gap-1">
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
                                    className="scale-75"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditDialog(bot);
                                    }}
                                    className="h-6 w-6"
                                  >
                                    <FaEdit className="h-3 w-3 text-blue-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      handleDeleteStrategy(bot.id, e);
                                    }}
                                    className="h-6 w-6"
                                  >
                                    <FaTrash className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="py-1 text-xs">
                                {bot.botName}
                              </TableCell>
                              <TableCell className="text-center py-1">
                                {bot.tradeType === "LONG" ? (
                                  <FaArrowUp className="text-green-500 mx-auto h-3 w-3" />
                                ) : bot.tradeType === "SHORT" ? (
                                  <FaArrowDown className="text-red-500 mx-auto h-3 w-3" />
                                ) : (
                                  <span className="text-xs">
                                    {bot.tradeType}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-center py-1 text-xs">
                                Min {bot.int}
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.oc}%
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.amount}$
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.extend}%
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.takeProfit}%
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.reduceTp}%
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.upReduce}%
                              </TableCell>
                              <TableCell className="text-right py-1 text-xs">
                                {bot.ignore}%
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}

      <DialogCustom
        open={isDialogOpen}
        onOpenChange={closeDialog}
        className="max-w-[95vw] md:max-w-[450px]"
      >
        <div className="max-h-[85vh] overflow-y-auto p-3">
          <StrategyForm
            onSuccess={handleStrategyAdded}
            symbolsList={symbolsList}
          />
        </div>
      </DialogCustom>

      <DialogCustom
        open={isEditDialogOpen}
        onOpenChange={closeEditDialog}
        className="max-w-[95vw] md:max-w-[450px]"
      >
        {editingStrategy && (
          <div className="max-h-[85vh] overflow-y-auto p-3">
            <StrategyForm
              strategy={{
                ...editingStrategy,
                tradeType: editingStrategy.tradeType as
                  | "LONG"
                  | "SHORT"
                  | "BOTH",
              }}
              isEditing={true}
              onSuccess={() => {
                refetch();
                closeEditDialog();
              }}
              symbolsList={symbolsList}
            />
          </div>
        )}
      </DialogCustom>

      <DialogCustom
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        className="max-w-[90vw] md:max-w-[350px]"
      >
        <div className="p-3 space-y-3">
          <h3 className="text-base font-semibold">Confirm Deletion</h3>
          <p className="text-muted-foreground text-xs">
            Are you sure you want to delete this strategy? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              size="sm"
              className="text-xs py-1 px-2 h-7"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              size="sm"
              className="text-xs py-1 px-2 h-7"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogCustom>
    </div>
  );
};

export default StrategyTable;
