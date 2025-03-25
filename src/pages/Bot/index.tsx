import BotTable from "@/components/ui/BotTable.tsx";
import { useUserStore } from "@/store/useUserStore.ts";

const Bots = () => {
  const { users } = useUserStore();
  console.log(users, "123");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bots</h1>
      <BotTable />
    </div>
  );
};

export default Bots;
