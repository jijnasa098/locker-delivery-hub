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
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied';
  packageDetails?: {
    id: string;
    recipientName: string;
    productId: string;
    trackingNumber?: string;
    comments?: string;
    placedBy: string;
    placedAt: Date;
    retrievedBy?: string;
    retrievedAt?: Date;
  };
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

// Generate lockers with the updated interface
export const lockers: Locker[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  size: i % 3 === 0 ? 'small' : i % 3 === 1 ? 'medium' : 'large',
  status: i % 5 === 0 ? 'occupied' : 'available',
  ...(i % 5 === 0 && {
    packageDetails: {
      id: `pkg_${i}`,
      recipientName: `Resident ${i}`,
      productId: `PROD-${1000 + i}`,
      trackingNumber: `TRK-${2000 + i}`,
      placedBy: 'System Admin',
      placedAt: new Date(Date.now() - Math.random() * 1000000000),
    }
  })
}));

// Helper functions
export const getUserPackages = (userId: string): Package[] => {
  return packages.filter((pkg) => pkg.recipientId === userId);
};

export const getAvailableLockers = (size: "small" | "medium" | "large"): Locker[] => {
  return lockers.filter((locker) => locker.status === "available" && locker.size === size);
};
