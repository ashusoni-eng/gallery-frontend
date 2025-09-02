import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateGroupDialogProps {
  children: React.ReactNode;
  onConfirm: (groupName: string) => void;
}

export function CreateGroupDialog({ children, onConfirm }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(groupName);
    setGroupName(""); // Clear input after confirm
    setIsOpen(false); // Close dialog
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Image Group</AlertDialogTitle>
          <AlertDialogDescription>
            Enter a name for your new image group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupName" className="text-right">
              Group Name
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setGroupName("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!groupName.trim()}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
