import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { getBots } from "@/services/BotServices.ts";
import {
  createStrategy,
  getStrategies,
} from "@/services/StrategiesServices.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  botId: z.string().min(1, "Bot is required"),
  int: z.coerce.number().min(1, "Interval is required"),
  tradeType: z.enum(["BOTH", "LONG", "SHORT"]),
  oc: z.coerce.number().min(0, "OC must be a positive number"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  extend: z.coerce.number().min(0, "Extend must be a positive number"),
  takeProfit: z.coerce.number().min(0, "Take Profit must be a positive number"),
  reduceTp: z.coerce.number().min(0, "Reduce TP must be a positive number"),
  upReduce: z.coerce.number().min(0, "Up Reduce must be a positive number"),
  ignore: z.coerce.number().min(0, "Ignore must be a positive number"),
  ps: z.coerce.number().min(0, "PS must be a positive number"),
  cs: z.coerce.number().min(0, "CS must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

// Add this to your imports
import { updateStrategy } from "@/services/StrategiesServices.ts";
import { useEffect, useState } from "react";
import axios from "axios";

// Update the StrategyFormProps interface
interface StrategyFormProps {
  onSuccess?: () => void;
  strategy?: {
    id: string;
    symbol: string;
    botId: string;
    int: number;
    tradeType: "BOTH" | "LONG" | "SHORT";
    oc: number;
    amount: number;
    extend: number;
    takeProfit: number;
    reduceTp: number;
    upReduce: number;
    ignore: number;
    ps: number;
    cs: number;
    isActive: boolean;
    botName?: string;
  };
  isEditing?: boolean;
  symbolsList?: string[];
}

// Update the component to handle editing
const StrategyForm = ({
  onSuccess,
  strategy,
  isEditing = false,
  symbolsList,
}: StrategyFormProps) => {
  const { data: botsData } = useQuery({
    queryKey: ["bots"],
    queryFn: getBots,
  });

  const storedBots = typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("bots") || "[]")
    : [];

  const { data: strategiesData } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
  });

  const getContractDetail = async (symbol: string) => {
    const response = await axios.get(`mexc/api/v1/contract/detailV2`, {
      params: {
        client: "web",
        symbol,
      },
    });
    return response.data;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      isEditing && strategy
        ? {
          symbol: strategy.symbol,
          botId: strategy.botId,
          int: strategy.int,
          tradeType: strategy.tradeType as "BOTH" | "LONG" | "SHORT",
          oc: strategy.oc,
          amount: strategy.amount,
          extend: strategy.extend,
          takeProfit: strategy.takeProfit,
          reduceTp: strategy.reduceTp,
          upReduce: strategy.upReduce,
          ignore: strategy.ignore,
          ps: strategy.ps,
          cs: strategy.cs,
        }
        : {
          symbol: "",
          botId: "",
          int: 5,
          tradeType: "BOTH",
          oc: 0,
          amount: 0,
          extend: 0,
          takeProfit: 0,
          reduceTp: 0,
          upReduce: 0,
          ignore: 0,
        },
  });

  const selectedSymbol = useWatch({
    control: form.control,
    name: "symbol",
  });

  useEffect(() => {
    if (!!isEditing) return
    const fetchContractData = async () => {
      if (selectedSymbol) {
        try {
          const data = await getContractDetail(selectedSymbol);
          form.setValue("cs", data.data[0].cs || 0);
          form.setValue("ps", data.data[0].ps || 0);
        } catch (error) {
          console.error("Failed to fetch contract detail", error);
        }
      }
    };

    fetchContractData();
  }, [selectedSymbol]);

  // Add update mutation
  // Add the missing createStrategyMutation
  const createStrategyMutation = useMutation({
    mutationFn: createStrategy,
    onSuccess: () => {
      toast.success("Strategy created successfully");
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create strategy: ${error}`);
    },
  });

  // Existing updateStrategyMutation
  const updateStrategyMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (isEditing && strategy) {
        return updateStrategy({
          id: strategy.id,
          int: data.int,
          tradeType: data.tradeType,
          oc: data.oc,
          amount: data.amount,
          extend: data.extend,
          takeProfit: data.takeProfit,
          reduceTp: data.reduceTp,
          upReduce: data.upReduce,
          ignore: data.ignore,
          ps: data.ps,
          cs: data.cs,
          isActive: strategy.isActive, // Preserve the current active state
        });
      }
      throw new Error("Cannot update without strategy ID");
    },
    onSuccess: () => {
      toast.success("Strategy updated successfully");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to update strategy: ${error}`);
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isEditing && strategy) {
      updateStrategyMutation.mutate(data);
    } else {
      createStrategyMutation.mutate({
        symbol: data.symbol,
        botId: data.botId,
        int: data.int,
        tradeType: data.tradeType,
        oc: data.oc,
        amount: data.amount,
        extend: data.extend,
        takeProfit: data.takeProfit,
        reduceTp: data.reduceTp,
        upReduce: data.upReduce,
        ignore: data.ignore,
        ps: data.ps,
        cs: data.cs,
      });
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Strategy" : "Add New Strategy"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Symbol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select a symbol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {symbolsList.map((symbol: string) => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="int"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Interval</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Min 1</SelectItem>
                        <SelectItem value="5">Min 5</SelectItem>
                        <SelectItem value="15">Min 15</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">OC (%)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="extend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Extend (%)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reduceTp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Reduce TP (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ignore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Ignore (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="cs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">CS</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="botId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Bot</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select a bot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Use the bots from strategies data if available, otherwise fall back to botsData */}
                        {storedBots.length > 0
                          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          storedBots.map((bot: any) => (
                            <SelectItem key={bot.id} value={bot.id}>
                              {bot.name}
                            </SelectItem>
                          ))
                          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          botsData?.data?.map((bot: any) => (
                            <SelectItem key={bot.id} value={bot.id}>
                              {bot.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Trade Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select trade type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BOTH">Both</SelectItem>
                        <SelectItem value="LONG">Long</SelectItem>
                        <SelectItem value="SHORT">Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Take Profit (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="upReduce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Up Reduce (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="ps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">PS</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="min-w-[100px]"
              onClick={() => form.reset()}
              disabled={
                createStrategyMutation.isPending ||
                updateStrategyMutation.isPending
              }
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="min-w-[150px]"
              disabled={
                createStrategyMutation.isPending ||
                updateStrategyMutation.isPending
              }
            >
              {createStrategyMutation.isPending ||
                updateStrategyMutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Update Strategy"
                  : "Create Strategy"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StrategyForm;
