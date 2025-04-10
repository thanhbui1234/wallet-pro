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
import { showCustomToast } from "@/components/ui/toats.tsx";
import { useAuthStore } from "@/store/authStore.ts";
import { useNavigate } from "react-router-dom";

const Right = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(navigate);
    navigate("/login");
    showCustomToast({
      type: "success",
      message: "BYE BYE!",
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="src/assets/hanoi-crypto-bros.jpg" />
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
