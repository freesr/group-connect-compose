
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface DeleteGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteGroupDialog({
  open,
  onOpenChange,
  groupName,
  onConfirm,
  isDeleting,
}: DeleteGroupDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            You're about to delete {groupName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="mt-2 text-sm text-gray-300">
          <p>This action cannot be undone. Deleting this group will:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Remove all members from the group.</li>
            <li>Remove the group from all projects and resources.</li>
          </ul>
        </div>
        
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-transparent text-white border-gray-700 hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Group"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
