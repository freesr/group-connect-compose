
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Group, User, fetchUsers, updateGroupMembers } from "@/lib/api";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "./UserAvatar";
import { Search, Users, X } from "lucide-react";
import { toast } from "sonner";

interface EditMembersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
}

export function EditMembersSheet({ open, onOpenChange, group }: EditMembersSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const queryClient = useQueryClient();

  // Reset selected users when group changes
  useEffect(() => {
    if (group && open) {
      setSelectedUsers(group.members);
    }
  }, [group, open]);

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Update members mutation
  const updateMembersMutation = useMutation({
    mutationFn: async () => {
      if (!group) return;
      await updateGroupMembers(
        group.id,
        selectedUsers.map((u) => u.id)
      );
    },
    onSuccess: () => {
      // First close the sheet, then run other operations
      onOpenChange(false);
      
      // Wait a tick before updating state to prevent UI freeze
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
        toast.success("Members updated successfully");
      }, 0);
    },
    onError: (error) => {
      console.error("Error updating members:", error);
      toast.error("Failed to update members");
    }
  });

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateMembersMutation.mutate();
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery("");
  };

  if (!group) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-gray-800 bg-black text-white">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white">Edit Member(s)</SheetTitle>
          <p className="text-gray-400 text-sm">
            Manage group members for {group.name}
          </p>
        </SheetHeader>

        <form className="space-y-6 mt-4" onSubmit={(e) => e.preventDefault()}>
          {/* Search Users */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Add user(s)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white pl-10"
              />
            </div>
          </div>

          {/* Selected Users */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-300">Members</p>
              </div>
              <span className="bg-gray-800 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                {selectedUsers.length}
              </span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded bg-gray-900">
                    <div className="flex items-center gap-2">
                      <UserAvatar user={user} size="sm" />
                      <div>
                        <p className="text-sm text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role || "Member"}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => handleUserRemove(user.id)}
                      type="button"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">No members selected</p>
              )}
            </div>
          </div>

          {/* User List */}
          {searchQuery && (
            <div className="max-h-60 overflow-y-auto space-y-2 border-t border-gray-800 pt-2">
              {filteredUsers
                .filter((user) => !selectedUsers.some((u) => u.id === user.id))
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar user={user} size="sm" />
                      <div>
                        <p className="text-sm text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role || "Member"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              {filteredUsers.filter((user) => !selectedUsers.some((u) => u.id === user.id)).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No users found</p>
              )}
            </div>
          )}

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
              disabled={updateMembersMutation.isPending}
              className="bg-teal-500 text-white hover:bg-teal-600"
              type="button"
            >
              {updateMembersMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
