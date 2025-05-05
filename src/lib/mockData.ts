
// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  apartment?: string;
  phone?: string;
}

export interface Package {
  id: string;
  trackingNumber: string;
  recipient: string;
  recipientId: string;
  status: "pending" | "delivered" | "collected";
  courier: string;
  description?: string;
  lockerNumber?: number;
  deliveredAt?: Date;
  collectedAt?: Date;
  size: "small" | "medium" | "large";
}

export interface Locker {
  id: number;
  size: "small" | "medium" | "large";
  status: "available" | "occupied";
  packageId?: string;
}

// Mock users
export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    apartment: "A201",
    phone: "555-1234",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    apartment: "B102",
    phone: "555-5678",
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    phone: "555-9012",
  },
];

// Mock packages
export const packages: Package[] = [
  {
    id: "p1",
    trackingNumber: "TRK123456789",
    recipient: "John Doe",
    recipientId: "u1",
    status: "delivered",
    courier: "FedEx",
    description: "Books from Amazon",
    lockerNumber: 3,
    deliveredAt: new Date("2025-05-04T10:30:00"),
    size: "medium",
  },
  {
    id: "p2",
    trackingNumber: "TRK987654321",
    recipient: "Jane Smith",
    recipientId: "u2",
    status: "pending",
    courier: "UPS",
    description: "Clothing package",
    size: "small",
  },
  {
    id: "p3",
    trackingNumber: "TRK112233445",
    recipient: "John Doe",
    recipientId: "u1",
    status: "collected",
    courier: "DHL",
    description: "Electronics",
    lockerNumber: 5,
    deliveredAt: new Date("2025-05-01T14:15:00"),
    collectedAt: new Date("2025-05-02T09:45:00"),
    size: "large",
  },
];

// Mock lockers
export const lockers: Locker[] = [
  { id: 1, size: "small", status: "available" },
  { id: 2, size: "small", status: "available" },
  { id: 3, size: "medium", status: "occupied", packageId: "p1" },
  { id: 4, size: "medium", status: "available" },
  { id: 5, size: "large", status: "occupied", packageId: "p3" },
  { id: 6, size: "large", status: "available" },
  { id: 7, size: "small", status: "available" },
  { id: 8, size: "medium", status: "available" },
  { id: 9, size: "large", status: "available" },
];

// Helper functions
export const getUserPackages = (userId: string): Package[] => {
  return packages.filter((pkg) => pkg.recipientId === userId);
};

export const getAvailableLockers = (size: "small" | "medium" | "large"): Locker[] => {
  return lockers.filter((locker) => locker.status === "available" && locker.size === size);
};
