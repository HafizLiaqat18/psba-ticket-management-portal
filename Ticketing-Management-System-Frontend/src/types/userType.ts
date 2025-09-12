export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedTo?: {
    _id:string
    name: string;
  };
  assignedToType: "Department" | "Market";  // instead of string
  active: boolean;
};