
// Mock API functions for group management
import { useState } from "react";

// Types
export interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  role?: string;
}

export interface Group {
  id: string;
  name: string;
  picture?: string;
  managers: User[];
  members: User[];
  createdAt: string;
}

// Mock users data
const mockUsers: User[] = [
  { id: "1", name: "Elshank Gakhar", initials: "EG", role: "Group Manager" },
  { id: "2", name: "Peter Uston", initials: "PU" },
  { id: "3", name: "Kelly Parker", initials: "KP" },
  { id: "4", name: "John Doe", initials: "JD" },
  { id: "5", name: "Jane Smith", initials: "JS" },
  { id: "6", name: "Alex Johnson", initials: "AJ" },
  { id: "7", name: "Sam Wilson", initials: "SW" },
  { id: "8", name: "Mary Davis", initials: "MD" },
];

// Mock groups data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Group 1",
    managers: [mockUsers[0], mockUsers[1]],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "2",
    name: "Group 2",
    managers: [mockUsers[0]],
    members: [mockUsers[0]],
    createdAt: "2025-01-12T00:00:00Z",
  },
  {
    id: "3",
    name: "Group 3",
    managers: [mockUsers[0]],
    members: [mockUsers[0]],
    createdAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Group 4",
    managers: [mockUsers[0]],
    members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[4]],
    createdAt: "2025-01-16T00:00:00Z",
  },
];

// Create a function to generate a random id
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// API functions
export const fetchGroups = async (): Promise<Group[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGroups);
    }, 500);
  });
};

export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 500);
  });
};

export const createGroup = async (
  name: string,
  picture?: string,
  managerIds?: string[]
): Promise<{ id: string }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = generateId();
      const managers = managerIds
        ? mockUsers.filter((user) => managerIds.includes(user.id))
        : [mockUsers[0]];
      
      const newGroup: Group = {
        id,
        name,
        picture,
        managers,
        members: [...managers],
        createdAt: new Date().toISOString(),
      };
      
      mockGroups.push(newGroup);
      resolve({ id });
    }, 500);
  });
};

export const addUserToGroup = async (
  groupId: string,
  userId: string
): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockGroups.find((g) => g.id === groupId);
      const user = mockUsers.find((u) => u.id === userId);
      
      if (group && user && !group.members.find((m) => m.id === userId)) {
        group.members.push(user);
      }
      
      resolve();
    }, 300);
  });
};

export const updateGroup = async (
  groupId: string,
  data: { name?: string; picture?: string }
): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockGroups.find((g) => g.id === groupId);
      
      if (group) {
        if (data.name) group.name = data.name;
        if (data.picture) group.picture = data.picture;
      }
      
      resolve();
    }, 500);
  });
};

export const updateGroupMembers = async (
  groupId: string,
  memberIds: string[]
): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockGroups.find((g) => g.id === groupId);
      
      if (group) {
        group.members = mockUsers.filter((user) => memberIds.includes(user.id));
      }
      
      resolve();
    }, 500);
  });
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockGroups.findIndex((g) => g.id === groupId);
      
      if (index !== -1) {
        mockGroups.splice(index, 1);
      }
      
      resolve();
    }, 500);
  });
};
