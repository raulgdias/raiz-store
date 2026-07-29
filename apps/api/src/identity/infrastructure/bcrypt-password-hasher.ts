import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import type { PasswordHasher } from "../application/auth.ports";

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
