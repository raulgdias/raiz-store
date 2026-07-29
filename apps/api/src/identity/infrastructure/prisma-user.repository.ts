import { Injectable } from "@nestjs/common";
import type { UserRecord, UserRepository } from "../domain/user.repository";
import { PrismaService } from "../../shared/infrastructure/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      role: user.role,
    };
  }
}
