import type { FastifyInstance } from "fastify";
import * as Sentry from "@sentry/node";
import type { AppConfig } from "../config/env.js";

export async function registerSentry(fastify: FastifyInstance, config: AppConfig) {
  if (!config.SENTRY_DSN) {
    fastify.log.warn("SENTRY_DSN not provided. Skipping Sentry setup.");
    return;
  }

  Sentry.init({
    dsn: config.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: config.NODE_ENV,
  });

  fastify.addHook("onRequest", async (request) => {
    Sentry.getCurrentHub().configureScope((scope) => {
      scope.addEventProcessor((event) => {
        event.request = {
          method: request.method,
          url: request.url,
          headers: request.headers,
        };
        return event;
      });
    });
  });

  fastify.addHook("onError", async (_request, _reply, error) => {
    Sentry.captureException(error);
  });
}
