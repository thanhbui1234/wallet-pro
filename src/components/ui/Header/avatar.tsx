import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

const AvatarHeader = () => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>Bot</AvatarFallback>
    </Avatar>
  );
};

export default AvatarHeader;
