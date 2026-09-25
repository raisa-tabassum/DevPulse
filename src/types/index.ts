export const roles = ["maintainer", "contributor"] as const;

export type Role = (typeof roles)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};

export type RUser = Omit<
  User,
  "id" | "created_at" | "updated_at" | "password_hash"
>;

export type Issues = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};
