import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAuthStore } from "@/store/authStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

// Schema validation với zod
const loginSchema = z.object({
  username: z.string().min(5, "username  is requited"),
  password: z.string().min(2, "password is requited"),
});

export default function Login() {
  const navigate = useNavigate();
  // State để lưu trữ lỗi nếu có lỗi từ API hoặc schem
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: { username: string; password: string }) => {
    login(data.username, data.password, navigate);
    setErrorMessage("");
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label className="mb-4" htmlFor="username">
              username
            </Label>
            <Input
              id="username"
              type="username"
              placeholder="Nhập username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Label className="mb-4" htmlFor="password">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
