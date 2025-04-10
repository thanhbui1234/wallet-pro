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
  const [isCustomDialog1Open, setIsCustomDialog1Open] = useState(false);
  const [isCustomDialog2Open, setIsCustomDialog2Open] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedBot, setSelectedBot] = useState("");
  const [expandedStrategies, setExpandedStrategies] = useState<{
    [key: string]: boolean;
  }>({});
  const [strategiesState, setStrategiesState] = useState<GroupedStrategy[]>([]);
  // Removed unused state since applyAllState was not being used
  const [showApplyAllOptions, setShowApplyAllOptions] = useState(false);
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
        <div className="flex flex-col gap-2 absolute bottom-[30%] right-[1%]">
          <Button
            onClick={openDialog}
            size="sm"
            className="text-xs py-1 px-2 z-20"
          >
            +
          </Button>

          <Button
            onClick={() => setIsCustomDialog1Open(true)}
            size="sm"
            className="text-xs py-1 px-2 bg-blue-500 hover:bg-blue-600 z-20"
          >
            Copy
          </Button>

          <Button
            onClick={() => setIsCustomDialog2Open(true)}
            size="sm"
            className="text-xs py-1 px-2 bg-green-500 hover:bg-green-600 z-20"
          >
            gay
          </Button>
        </div>
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

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="applyAllCheckbox"
                  className="rounded border-gray-300 h-4 w-4"
                  checked={showApplyAllOptions}
                  onChange={() => setShowApplyAllOptions(!showApplyAllOptions)}
                />
                <label
                  htmlFor="applyAllCheckbox"
                  className="text-xs cursor-pointer"
                >
                  Apply All
                </label>
              </div>

              {showApplyAllOptions && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyAllBotsState(true)}
                    className="h-7 text-xs py-1 px-2 bg-white"
                  >
                    On
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyAllBotsState(false)}
                    className="h-7 text-xs py-1 px-2 bg-white"
                  >
                    Off
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                    <FaTrash className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                    <FaEdit className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
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
      <DialogCustom
        open={isCustomDialog1Open}
        onOpenChange={setIsCustomDialog1Open}
        className="max-w-[95vw] md:max-w-[450px]"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Clone Strategy</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCustomDialog1Open(false)}
              className="h-6 w-6 rounded-full"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span> Copy to
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span> Copy from
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCustomDialog1Open(false)}
                size="sm"
                className="text-xs py-1 px-3"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle clone action
                  setIsCustomDialog1Open(false);
                }}
                size="sm"
                className="text-xs py-1 px-3"
              >
                Clone
              </Button>
            </div>
          </div>
        </div>
      </DialogCustom>

      <DialogCustom
        open={isCustomDialog2Open}
        onOpenChange={setIsCustomDialog2Open}
        className="max-w-[95vw] md:max-w-[450px]"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Import Strategy</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCustomDialog2Open(false)}
              className="h-6 w-6 rounded-full"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span> Bot
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bot" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Select File</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2 text-sm"
                  onClick={() => {
                    // Trigger file input click
                    document.getElementById("file-upload")?.click();
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5523 3.44772 13 4 13H11C11.5523 13 12 12.5523 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.1046 12.1046 14 11 14H4C2.89543 14 2 13.1046 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Select File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".json,.csv"
                  onChange={(e) => {
                    // Handle file selection
                    console.log(e.target.files?.[0]);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: .json, .csv
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCustomDialog2Open(false)}
                size="sm"
                className="text-xs py-1 px-3"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle import action
                  setIsCustomDialog2Open(false);
                }}
                size="sm"
                className="text-xs py-1 px-3 bg-blue-500 hover:bg-blue-600"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </DialogCustom>
    </div>
  );
};

export default StrategyTable;
