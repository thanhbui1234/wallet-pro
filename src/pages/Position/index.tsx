import PositionTable from "@/components/ui/PositionTable.tsx";

const Position = () => {
  // const { users } = useUserStore();
  // console.log(users, "123");

  return (
    <div className=" w-full ">
      <h1 className="text-2xl font-bold mb-4">Position</h1>
      <PositionTable />
    </div>
  );
};

export default Position;
