
import { fetchGroups, deleteGroup, Group } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  User,
  Edit,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { GroupIcon } from "./GroupIcon";
import { UserAvatar, UserAvatarGroup } from "./UserAvatar";
import { CreateGroupSheet } from "./CreateGroupSheet";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { EditMembersSheet } from "./EditMembersSheet";
import { EditGroupSheet } from "./EditGroupSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function GroupList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMembersOpen, setEditMembersOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const queryClient = useQueryClient();

  // Fetch groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setDeleteDialogOpen(false);
    },
  });

  // Filter groups based on search
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / rowsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDeleteGroup = (group: Group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleEditMembers = (group: Group) => {
    setSelectedGroup(group);
    setEditMembersOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setEditGroupOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGroup) {
      deleteGroupMutation.mutate(selectedGroup.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGroupIconColor = (index: number) => {
    const colors = ["blue", "green", "red", "purple"] as const;
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Group Management</h1>
          <p className="text-gray-400">Manage groups for your organization.</p>
        </div>
        <Button
          onClick={() => setCreateGroupOpen(true)}
          className="bg-teal-500 text-white hover:bg-teal-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create a group
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">Groups</h2>
          {filteredGroups.length > 0 && (
            <span className="bg-gray-800 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {filteredGroups.length}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-900"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search group..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700 text-white"
        />
      </div>

      {/* Groups Table */}
      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 text-sm">
            <tr>
              <th className="py-3 px-4 font-medium">Group Name</th>
              <th className="py-3 px-4 font-medium">Group Manager</th>
              <th className="py-3 px-4 font-medium">Members</th>
              <th className="py-3 px-4 font-medium">
                <div className="flex items-center gap-1">
                  Date Created
                  <ChevronRight className="h-4 w-4" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-white">
            {paginatedGroups.length > 0 ? (
              paginatedGroups.map((group, index) => (
                <tr key={group.id} className="bg-black hover:bg-gray-900/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <GroupIcon color={getGroupIconColor(index)} picture={group.picture} />
                      <span>{group.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex -space-x-2">
                      {group.managers.map((manager) => (
                        <UserAvatar key={manager.id} user={manager} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <UserAvatarGroup users={group.members} />
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {formatDate(group.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-900 border-gray-800 text-white"
                      >
                        <DropdownMenuItem
                          className="hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleEditMembers(group)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Edit Member(s)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Group
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:bg-gray-800 hover:text-red-500 cursor-pointer"
                          onClick={() => handleDeleteGroup(group)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  Loading groups...
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  {searchQuery
                    ? "No groups found matching your search"
                    : "No groups found. Create your first group!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredGroups.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
          <div>
            {paginatedGroups.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredGroups.length)} of ${filteredGroups.length} row(s) selected.`
              : "0 of 0 row(s) selected."}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-900 border border-gray-700 rounded p-1 text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals/Sheets */}
      <CreateGroupSheet open={createGroupOpen} onOpenChange={setCreateGroupOpen} />
      
      <DeleteGroupDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        groupName={selectedGroup?.name || ""}
        onConfirm={confirmDelete}
        isDeleting={deleteGroupMutation.isPending}
      />
      
      <EditMembersSheet
        open={editMembersOpen}
        onOpenChange={setEditMembersOpen}
        group={selectedGroup}
      />
      
      <EditGroupSheet
        open={editGroupOpen}
        onOpenChange={setEditGroupOpen}
        group={selectedGroup}
      />
    </div>
  );
}
