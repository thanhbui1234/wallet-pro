import BotForm from "@/components/Bot/BotForm.tsx";
import BotTable from "@/components/ui/BotTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import DialogCustom from "@/components/ui/dialogCustom.tsx";
import { useBotStore } from "@/store/botStore.ts";

const Bots = () => {
  const { isDialogOpen, openDialog, closeDialog } = useBotStore();

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Bots</h1>
        <Button onClick={openDialog}>+ Add bot</Button>
      </div>
      <BotTable />
      <DialogCustom open={isDialogOpen} onOpenChange={closeDialog}>
        <BotForm />
      </DialogCustom>
    </div>
  );
};

export default Bots;
