import fp from "fastify-plugin";
import { fastifyApollo } from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";
import type { FastifyInstance } from "fastify";
import { typeDefs, resolvers, buildContext } from "../graphql/schema.js";

export default fp(async (fastify: FastifyInstance) => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apollo.start();

  fastify.register(fastifyApollo(apollo), {
    path: "/graphql",
    context: async ({ request }) => buildContext(request, fastify),
  });
});
