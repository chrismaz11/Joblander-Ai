import Fastify from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config/env.js";
import { registerSentry } from "./plugins/sentry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildServer() {
  const config = loadConfig();

  const server = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "SYS:standard",
                colorize: true,
              },
            }
          : undefined,
    },
  });

  await registerSentry(server, config);

  server.register(import("@fastify/cors"), {
    origin: config.CORS_ORIGIN ?? true,
    credentials: true,
  });
  server.register(import("@fastify/compress"), { global: false });
  server.register(import("@fastify/helmet"), { global: true });
  server.register(import("@fastify/sensible"));
  server.register(import("@fastify/swagger"), {
    openapi: {
      info: {
        title: "JobLander API",
        description:
          "Fastify backend powering JobLander AI resume, cover letter, and job automation platform.",
        version: "1.0.0",
      },
      servers: [
        {
          url: config.API_BASE_URL ?? `http://localhost:${config.PORT}`,
        },
      ],
    },
  });
  server.register(import("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });

  server.register(import("@fastify/jwt"), {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: "12h",
    },
  });

  server.decorate(
    "authenticate",
    async function authenticate(request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.status(401).send({ error: "Unauthorized" });
      }
    },
  );

  server.register(autoload, {
    dir: path.join(__dirname, "plugins"),
    ignorePattern: /sentry|auth/,
  });

  server.register(autoload, {
    dir: path.join(__dirname, "routes"),
    encapsulate: false,
    matchFilter: (pathName) => pathName.endsWith(".js"),
    autoHooks: true,
  });

  server.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Unhandled error");
    if (!reply.sent) {
      reply
        .status(error.statusCode ?? 500)
        .send({ error: "Internal Server Error" });
    }
  });

  return server;
}

async function start() {
  const server = await buildServer();
  const config = loadConfig();

  try {
    await server.listen({ port: config.PORT, host: "0.0.0.0" });
    server.log.info(`Server listening on port ${config.PORT}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start();
}

export { buildServer };
