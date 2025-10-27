import type { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(120).optional(),
});

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        body: credentialsSchema.extend({ name: z.string().min(2).optional() }),
        response: {
          201: z.object({
            id: z.string(),
            email: z.string().email(),
            premium: z.boolean(),
            token: z.string(),
          }),
        },
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const body = credentialsSchema.parse(request.body);

      const existing = await app.prisma.user.findUnique({
        where: { email: body.email.toLowerCase() },
      });

      if (existing) {
        return reply.status(409).send({ error: "User already exists." });
      }

      const hashed = await bcrypt.hash(body.password, 12);

      const user = await app.prisma.user.create({
        data: {
          email: body.email.toLowerCase(),
          password: hashed,
          name: body.name,
        },
      });

      const token = app.jwt.sign({ sub: user.id, email: user.email });

      reply.status(201).send({
        id: user.id,
        email: user.email,
        premium: user.premium,
        token,
      });
    },
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: credentialsSchema.pick({ email: true, password: true }),
        response: {
          200: z.object({
            token: z.string(),
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string().nullable(),
              premium: z.boolean(),
            }),
          }),
        },
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const body = credentialsSchema.pick({ email: true, password: true }).parse(request.body);
      const user = await app.prisma.user.findUnique({
        where: { email: body.email.toLowerCase() },
      });
      if (!user) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(body.password, user.password);
      if (!valid) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }
      const token = app.jwt.sign({ sub: user.id, email: user.email });
      reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          premium: user.premium,
        },
      });
    },
  );

  app.get(
    "/auth/me",
    {
      preHandler: app.authenticate,
      schema: {
        response: {
          200: z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string().nullable(),
            premium: z.boolean(),
            createdAt: z.string(),
          }),
        },
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const user = await app.prisma.user.findUnique({
        where: { id: (request.user as { sub: string }).sub },
      });
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }
      reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        premium: user.premium,
        createdAt: user.createdAt.toISOString(),
      });
    },
  );
}
