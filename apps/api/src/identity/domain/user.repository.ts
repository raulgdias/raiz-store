import type { UserRole } from "@raizstore/contracts";

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
}

export interface UserRepository {
  findByUsername(username: string): Promise<UserRecord | null>;
}
