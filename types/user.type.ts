export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "USER";
  address: string;
  city: string;
  postalCode: number;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface userTable {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
  address: string;
  city: string;
  postalCode: number;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
