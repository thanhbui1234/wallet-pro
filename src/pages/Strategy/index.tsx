import StrategyTable from "@/components/ui/strategy.tsx";
import { useUserStore } from "@/store/useUserStore.ts";

const Strategy = () => {
  const { users } = useUserStore();
  console.log(users, "123");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Strategy</h1>
      <StrategyTable />
    </div>
  );
};

export default Strategy;
