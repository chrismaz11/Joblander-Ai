import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaClient = new PrismaClient();

export default fp(async (fastify) => {
  fastify.addHook("onClose", async () => {
    await prismaClient.$disconnect();
  });
  fastify.decorate("prisma", prismaClient);
});
