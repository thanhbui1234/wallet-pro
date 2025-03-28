import BotTable from "@/components/ui/BotTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUserStore } from "@/store/useUserStore.ts";

const Bots = () => {
  const { users } = useUserStore();
  console.log(users, "123");

  return (
    <div className=" w-full ">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Bots</h1>
        <Button>+ Add bot</Button>
      </div>
      <BotTable />
    </div>
  );
};

export default Bots;
