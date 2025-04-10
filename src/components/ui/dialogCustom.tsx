import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog.tsx";

interface DialogCustomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string; // Add className prop
}

const DialogCustom = ({
  open,
  onOpenChange,
  children,
  className,
}: DialogCustomProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>{children}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCustom;
