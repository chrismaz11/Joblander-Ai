import type { User as DbUser } from "../../shared/schema";

declare module "express-serve-static-core" {
  interface Request {
    user?: Pick<DbUser, "id" | "email">;
  }
}
