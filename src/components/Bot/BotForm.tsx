import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { createBot, updateBot } from "@/services/BotServices.ts";
import {
  Bot,
  showErrorToast,
  showSuccessToast,
  useBotStore,
} from "@/store/botStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validation with zod
const botSchema = z.object({
  name: z.string().min(1, "Bot Name is required"),
  u_id: z.string().min(1, "User ID is required"),
  accessKey: z.string().min(1, "Access Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  proxy: z.string().min(1, "Proxy is required"),
  telegramId: z
    .number()
    .int("Telegram ID must be an integer")
    .nullable()
    .optional(),
});

type BotFormValues = z.infer<typeof botSchema>;

const BotForm = () => {
  const closeDialog = useBotStore((state) => state.closeDialog);
  const selectedBot = useBotStore((state) => state.selectedBot);
  const queryClient = useQueryClient();

  const isUpdateMode = !!selectedBot;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BotFormValues>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: "",
      u_id: "",
      accessKey: "",
      secretKey: "",
      proxy: "",
      telegramId: undefined,
    },
  });

  // Set form values when selectedBot changes
  useEffect(() => {
    if (selectedBot) {
      reset({
        name: selectedBot.name,
        u_id: selectedBot.u_id,
        accessKey: selectedBot.accessKey,
        secretKey: selectedBot.secretKey,
        proxy: selectedBot.proxy,
        telegramId: selectedBot.telegramId,
      });
    }
  }, [selectedBot, reset]);

  const createBotMutation = useMutation({
    mutationFn: (data: Bot) => createBot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      showSuccessToast("Bot created successfully");
      closeDialog();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const updateBotMutation = useMutation({
    mutationFn: (data: Bot) => updateBot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bots"] });
      showSuccessToast("Bot updated successfully");
      closeDialog();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const handleFormSubmit = async (data: BotFormValues) => {
    try {
      if (isUpdateMode && selectedBot) {
        // Include the ID when updating
        updateBotMutation.mutate({
          ...data,
          id: selectedBot.id,
        } as Bot);
      } else {
        createBotMutation.mutate(data as Bot);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold mb-2"z>
        {isUpdateMode ? "Update Bot" : "Create Bot"}
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="space-y-2">
          <div>
            <Label htmlFor="name" className="text-sm">
              * Bot Name
            </Label>
            <Input
              id="name"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs text-left">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="u_id" className="text-sm">
              * u_id
            </Label>
            <Input
              id="u_id"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("u_id")}
            />
            {errors.u_id && (
              <p className="text-red-500 text-xs text-left">
                {errors.u_id.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="accessKey" className="text-sm">
              * accessKey
            </Label>
            <Input
              id="accessKey"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("accessKey")}
            />
            {errors.accessKey && (
              <p className="text-red-500 text-xs text-left">
                {errors.accessKey.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="secretKey" className="text-sm">
              * secretKey
            </Label>
            <Input
              id="secretKey"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("secretKey")}
            />
            {errors.secretKey && (
              <p className="text-red-500 text-xs text-left">
                {errors.secretKey.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="proxy" className="text-sm">
              * Proxy
            </Label>
            <Input
              id="proxy"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("proxy")}
            />
            {errors.proxy && (
              <p className="text-red-500 text-xs text-left">
                {errors.proxy.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="telegramId" className="text-sm">
              Telegram ID
            </Label>
            <Input
              id="telegramId"
              type="number"
              className="border border-gray-300 h-8 text-sm mt-1"
              {...register("telegramId", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.telegramId && (
              <p className="text-red-500 text-xs text-left">
                {errors.telegramId.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 h-8 text-sm"
              disabled={
                isSubmitting ||
                createBotMutation.isPending ||
                updateBotMutation.isPending
              }
            >
              {createBotMutation.isPending || updateBotMutation.isPending
                ? "Saving..."
                : isUpdateMode
                  ? "Update Bot"
                  : "Save Bot"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BotForm;
