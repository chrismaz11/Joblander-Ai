import { Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { db } from "./db";
import { users } from "../shared/schema";
import type { UpsertUser } from "../shared/schema";
import { eq } from "drizzle-orm";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export async function verifyToken(req: Request, res: Response, next: any) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = await verifier.verify(token);
    const email =
      typeof payload.email === "string" ? payload.email : undefined;
    req.user = { id: payload.sub, email };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { id, email, firstName, lastName } = req.body;

    const newUserData: UpsertUser = {
      id,
      email,
      firstName,
      lastName,
      tier: "free",
    };

    const [newUser] = await db.insert(users).values(newUserData).returning();

    res.json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUserTier(req: Request, res: Response) {
  try {
    const { tier } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({ tier, updatedAt: new Date() } as Partial<UpsertUser>)
      .where(eq(users.id, req.user.id))
      .returning();

    res.json(updatedUser[0] ?? null);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user tier" });
  }
}
