import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { changeBotStatus, getBots } from "@/services/BotServices.ts";
import {
  Bot,
  showErrorToast,
  showSuccessToast,
  useBotStore,
} from "@/store/botStore.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button.tsx";
import { Switch } from "./switch.tsx";

const BotTable = () => {
  const selectBot = useBotStore((state) => state.selectBot);
  const openDialog = useBotStore((state) => state.openDialog);

  const queryClient = useQueryClient();

  // Fetch bots data using React Query
  const { data, isLoading } = useQuery({
    queryKey: ["bots"],
    queryFn: getBots,
    select: (response) => {
      // Check if response has a data property (common API pattern)
      if (response && response.data) {
        return response.data;
      }
      // If response is already the array we need
      return response || [];
    },
  });

  const bots = Array.isArray(data) ? data : [];
  if (JSON.stringify(bots) !== sessionStorage.getItem("bots")) {
    sessionStorage.setItem("bots", JSON.stringify(bots));
  }

  // State to track which bots are active
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (bots.length > 0) {
      const initial = Object.fromEntries(
        bots.map(bot => [bot.id, bot.status === "ACTIVE" ? true : false]) // fallback nếu bot.isActive bị undefined
      );
      setActiveBots(initial);
    }
  }, [bots]);

  const changeBotStatusMutation = useMutation({
    mutationFn: ({ botId, isActive }: { botId: string; isActive: boolean }) =>
      changeBotStatus(botId, isActive),
    onMutate: () => {
      return { isLoading: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      showSuccessToast("Bot status updated successfully");
    },
    onError: (error, variables) => {
      // Revert the optimistic update on error
      setActiveBots((prev) => ({
        ...prev,
        [variables.botId]: !variables.isActive,
      }));
      showErrorToast(error);
    },
    onSettled: () => {
      // Clear loading state after mutation completes (success or error)
      return { isLoading: false };
    },
  });

  const toggleBotStatus = (botId: string) => {
    const newStatus = !activeBots[botId];

    setActiveBots((prev) => ({
      ...prev,
      [botId]: newStatus,
    }));

    changeBotStatusMutation.mutate({
      botId,
      isActive: newStatus,
    });
  };

  const handleEdit = (bot: Bot) => {
    selectBot(bot);
    openDialog();
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-2 w-[80px]">Action</TableHead>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2">User ID</TableHead>
              <TableHead className="py-2">Access Key</TableHead>
              <TableHead className="py-2">Proxy</TableHead>
              <TableHead className="py-2">Telegram ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-16 text-xs">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-16 text-xs">
                  No bots found. Create your first bot!
                </TableCell>
              </TableRow>
            ) : (
              bots.map((bot: Bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="py-1">
                    <div className="flex items-center space-x-1">
                      <Switch
                        checked={!!activeBots[bot.id as string]}
                        onCheckedChange={() =>
                          toggleBotStatus(bot.id as string)
                        }
                        disabled={changeBotStatusMutation.isPending}
                        className="scale-75"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(bot)}
                        className="p-1 h-6 w-6"
                      >
                        <Edit size={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-xs">{bot.name}</TableCell>
                  <TableCell className="py-1 text-xs">{bot.u_id}</TableCell>
                  <TableCell className="py-1 text-xs">
                    {bot.accessKey}
                  </TableCell>
                  <TableCell className="py-1 text-xs">{bot.proxy}</TableCell>
                  <TableCell className="py-1 text-xs">
                    {bot.telegramId || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BotTable;
