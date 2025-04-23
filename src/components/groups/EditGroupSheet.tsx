
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Group, updateGroup } from "@/lib/api";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { GroupIcon } from "./GroupIcon";
import { toast } from "sonner";

interface EditGroupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
}

export function EditGroupSheet({ open, onOpenChange, group }: EditGroupSheetProps) {
  const [groupName, setGroupName] = useState("");
  const [groupPicture, setGroupPicture] = useState<string | undefined>();
  const queryClient = useQueryClient();

  // Reset form when group changes or sheet opens
  useEffect(() => {
    if (group && open) {
      setGroupName(group.name);
      setGroupPicture(group.picture);
    }
  }, [group, open]);

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async () => {
      if (!group) return;
      await updateGroup(group.id, {
        name: groupName,
        picture: groupPicture,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group updated successfully");
      handleClose();
    },
    onError: (error) => {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    },
  });

  const handleSave = () => {
    if (groupName.trim()) {
      updateGroupMutation.mutate();
    }
  };

  const handleClose = () => {
    // Ensure we're properly cleaning up when closing the sheet
    onOpenChange(false);
  };

  const handlePictureUpload = () => {
    // In a real app, this would open a file picker
    // For now, just set a placeholder
    setGroupPicture("/placeholder.svg");
  };

  const handlePictureRemove = () => {
    setGroupPicture(undefined);
  };

  // Prevent rendering if there's no group
  if (!group) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-gray-800 bg-black text-white overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white">Edit Group</SheetTitle>
          <p className="text-gray-400 text-sm">
            Update group information
          </p>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* Group Picture */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Group Picture</label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded overflow-hidden bg-blue-600 flex items-center justify-center">
                {groupPicture ? (
                  <img src={groupPicture} alt="Group" className="w-full h-full object-cover" />
                ) : (
                  <GroupIcon size="lg" />
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-transparent text-white border-gray-700 hover:bg-gray-900"
                onClick={handlePictureUpload}
              >
                <Upload size={16} />
                Upload
              </Button>
              {groupPicture && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 bg-transparent text-white border-gray-700 hover:bg-gray-900"
                  onClick={handlePictureRemove}
                >
                  <X size={16} />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Group name</label>
            <Input
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-transparent text-white border-gray-700 hover:bg-gray-900"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!groupName.trim() || updateGroupMutation.isPending}
              className="bg-teal-500 text-white hover:bg-teal-600"
              type="button"
            >
              {updateGroupMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
