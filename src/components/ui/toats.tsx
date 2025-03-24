// components/ui/CustomToast.tsx
import { Button } from "@/components/ui/button.tsx";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  type: ToastType;
  message: string;
}

export const showCustomToast = ({ type, message }: CustomToastProps) => {
  toast.custom((t) => {
    const iconMap = {
      success: <CheckCircle className="text-green-500" />,
      error: <XCircle className="text-red-500" />,
      warning: <AlertTriangle className="text-yellow-500" />,
      info: <AlertTriangle className="text-blue-500" />,
    };

    const typeStyles = {
      success: "border-green-500",
      error: "border-red-500",
      warning: "border-yellow-500",
      info: "border-blue-500",
    };

    return (
      <div
        className={`flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border-l-4 rounded-lg shadow-md w-full max-w-sm ${typeStyles[type]}`}
      >
        {iconMap[type]}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
          Dismiss
        </Button>
      </div>
    );
  });
};
