import { Button } from "@/components/ui/button.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useMemo } from "react";
import { RiExchangeCnyLine } from "react-icons/ri";

interface Bot {
  name: string;
  telegram: string;
  proxy: string;
  u_id: string;
  status: "active" | "inactive";
}

const bots: Bot[] = [
  {
    name: "Meowwww11",
    telegram: "-4662145730",
    proxy: "103.190.37.250:21330:nhro5619:NE/fab3647",
    u_id: "WEB4C7505...",
    status: "active",
  },
  {
    name: "tHÁ",
    telegram: "123",
    proxy: "123",
    u_id: "123",
    status: "inactive",
  },
];

export default function BotTable() {
  const columns = useMemo<ColumnDef<Bot>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "telegram", header: "Telegram" },
      { accessorKey: "proxy", header: "Proxy" },
      { accessorKey: "u_id", header: "u_id" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button size="icon" variant="outline">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="border rounded-lg shadow-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4"></div>
      <Table className="rounded-lg border">
        <TableHeader className="bg-gray-100">
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={
                  "accessorKey" in col
                    ? (col.accessorKey as string)
                    : (col.header as string)
                }
                className="text-left p-3"
              >
                {col.header as string}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot, i) => (
            <TableRow key={i} className="hover:bg-gray-50">
              <TableCell>{bot.name}</TableCell>
              <TableCell>{bot.telegram}</TableCell>
              <TableCell>{bot.proxy}</TableCell>
              <TableCell>{bot.u_id}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button size="icon" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Switch className="mt-2" />
                  <RiExchangeCnyLine size={19} className="mt-2" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
