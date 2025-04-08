import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { changeBotStatus, deleteBot, getBots } from "@/services/BotServices.ts";
import {
  Bot,
  showErrorToast,
  showSuccessToast,
  useBotStore,
} from "@/store/botStore.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./button.tsx";
import { Switch } from "./switch.tsx";

const BotTable = () => {
  const selectBot = useBotStore((state) => state.selectBot);
  const openDialog = useBotStore((state) => state.openDialog);

  // Remove console.log
  // console.log(selectBot, "selectBot");

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

  // Delete bot mutation
  const deleteBotMutation = useMutation({
    mutationFn: deleteBot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      showSuccessToast("Bot deleted successfully");
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bot?")) {
      deleteBotMutation.mutate(id);
    }
  };

  // State to track which bots are active
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>({});

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Access Key</TableHead>
            <TableHead>Proxy</TableHead>
            <TableHead>Telegram ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                Loading...
              </TableCell>
            </TableRow>
          ) : bots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No bots found. Create your first bot!
              </TableCell>
            </TableRow>
          ) : (
            bots.map(
              (bot: Bot) => (
                console.log(bot, "bot"),
                (
                  <TableRow key={bot.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!!activeBots[bot.id as string]}
                          onCheckedChange={() =>
                            toggleBotStatus(bot.id as string)
                          }
                          disabled={changeBotStatusMutation.isPending}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(bot)}
                          className="p-1 h-8 w-8"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(bot.id as string)}
                          className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                          disabled={deleteBotMutation.isPending}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{bot.name}</TableCell>
                    <TableCell>{bot.u_id}</TableCell>
                    <TableCell>{bot.accessKey}</TableCell>
                    <TableCell>{bot.proxy}</TableCell>
                    <TableCell>{bot.telegramId || "-"}</TableCell>
                  </TableRow>
                )
              )
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BotTable;
