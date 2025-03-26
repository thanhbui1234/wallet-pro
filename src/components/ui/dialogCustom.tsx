import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog.tsx";

interface DialogCustomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode; // Nhận JSX
}

const DialogCustom = ({ open, onOpenChange, children }: DialogCustomProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>{children}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCustom;
