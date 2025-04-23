
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, addUserToGroup, createGroup, fetchUsers } from "@/lib/api";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "./UserAvatar";
import { Search, Upload, X } from "lucide-react";
import { GroupIcon } from "./GroupIcon";

interface CreateGroupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupSheet({ open, onOpenChange }: CreateGroupSheetProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupPicture, setGroupPicture] = useState<string | undefined>();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async () => {
      const { id } = await createGroup(groupName, groupPicture);
      
      // Add all selected users to the group
      const promises = selectedUsers.map((user) => 
        addUserToGroup(id, user.id)
      );
      
      await Promise.all(promises);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      handleClose();
    },
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

  const handleCreate = () => {
    if (groupName.trim()) {
      createGroupMutation.mutate();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setGroupName("");
    setSearchQuery("");
    setSelectedUsers([]);
    setGroupPicture(undefined);
  };

  const handlePictureUpload = () => {
    // In a real app, this would open a file picker
    // For now, just set a placeholder
    setGroupPicture("/placeholder.svg");
  };

  const handlePictureRemove = () => {
    setGroupPicture(undefined);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-gray-800 bg-black text-white">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white">Create new group</SheetTitle>
          <p className="text-gray-400 text-sm">
            Invite users to collaborate on projects.
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

          {/* Invite Users */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Invite user(s)</label>
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
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-300">Users with Access</p>
                <span className="bg-gray-800 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedUsers.length}
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedUsers.map((user) => (
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
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!groupName.trim() || createGroupMutation.isPending}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              {createGroupMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
