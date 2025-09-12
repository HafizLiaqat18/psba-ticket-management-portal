export type Department = {
  _id: string;
  name: string;
};

export type Ticket = {
  department: Department;
  images: string[];
  _id: string;
  title: string;
  description: string;
  assignedTo: {
    _id: string;
    name: string;
  };
  priority: "Low" | "Medium" | "High";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdBy: {
    _id: string;
    name: string;
    assignedTo: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  customId:Number;
  inProgressAt: string;
  estimatedResolutionTime?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolvedIn?:Number | Date;
  comments: {
    comment: string;
    commentedBy: {
      _id: string;
      name: string;
    };
    _id: string;
    createdAt: string;
  }[];
  // __v: number;
};
