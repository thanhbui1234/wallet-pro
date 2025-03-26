import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { useAuthStore } from "@/store/authStore.ts";

const Right = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Bot</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        onClick={() => handleLogout()}
        className="w-auto p-2 cursor-pointer"
      >
        Logout
      </PopoverContent>
    </Popover>
  );
};

export default Right;
