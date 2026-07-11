export type AppRole =
  | "system_admin"
  | "employee"
  | "accountant"
  | "collaborator"
  | "client";

export const STAFF_ROLES: AppRole[] = [
  "system_admin",
  "employee",
  "accountant",
];

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: AppRole;
  is_active: boolean;
}

export function isStaff(profile: Pick<Profile, "role">) {
  return STAFF_ROLES.includes(profile.role);
}
