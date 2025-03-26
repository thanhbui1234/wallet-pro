import PositionTable from "@/components/ui/PositionTable.tsx";
import { useUserStore } from "@/store/useUserStore.ts";

const Position = () => {
  const { users } = useUserStore();
  console.log(users, "123");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Position</h1>
      <PositionTable />
    </div>
  );
};

export default Position;
