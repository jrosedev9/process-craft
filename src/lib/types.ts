// Project and Task types for use in components

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "To Do" | "In Progress" | "Done";
  order: number;
  createdAt: number | Date;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: number | Date;
  userId: string;
  tasks?: Task[];
};
