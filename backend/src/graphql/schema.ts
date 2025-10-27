import type { FastifyInstance, FastifyRequest } from "fastify";
import { gql } from "graphql-tag";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language/index.mjs";
import type { PrismaClient } from "@prisma/client";

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
    email: String!
    name: String
    premium: Boolean!
    createdAt: DateTime!
    resumes: [Resume!]!
    coverLetters: [CoverLetter!]!
  }

  type Resume {
    id: ID!
    userId: String!
    title: String!
    htmlContent: String!
    jsonSchema: JSON!
    templateRef: String
    createdAt: DateTime!
    coverLetters: [CoverLetter!]!
  }

  type CoverLetter {
    id: ID!
    userId: String!
    resumeId: String!
    title: String!
    content: String!
    htmlContent: String!
    createdAt: DateTime!
  }

  type JobMatch {
    id: ID!
    userId: String!
    title: String!
    company: String!
    url: String!
    source: String!
    score: Float
    createdAt: DateTime!
  }

  type Query {
    me: User
    resumes: [Resume!]!
    coverLetters(resumeId: ID): [CoverLetter!]!
    jobMatches: [JobMatch!]!
  }
`;

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  parseValue(value) {
    return new Date(value as string);
  },
  serialize(value) {
    return (value as Date).toISOString();
  },
});

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.INT:
        return Number(ast.value);
      case Kind.FLOAT:
        return Number(ast.value);
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.OBJECT: {
        const value: Record<string, unknown> = {};
        for (const field of ast.fields ?? []) {
          value[field.name.value] = JSONScalar.parseLiteral(field.value, null);
        }
        return value;
      }
      default:
        return null;
    }
  },
});

export const resolvers = {
  DateTime: DateTimeScalar,
  JSON: JSONScalar,
  Query: {
    me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      if (!ctx.userId) return null;
      return ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });
    },
    resumes: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new Error("Unauthorized");
      return ctx.prisma.resume.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
      });
    },
    coverLetters: (_: unknown, args: { resumeId?: string }, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new Error("Unauthorized");
      return ctx.prisma.coverLetter.findMany({
        where: {
          userId: ctx.userId,
          ...(args.resumeId ? { resumeId: args.resumeId } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
    },
    jobMatches: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new Error("Unauthorized");
      return ctx.prisma.jobMatch.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};

export interface GraphQLContext {
  prisma: PrismaClient;
  userId?: string;
}

export async function buildContext(
  request: FastifyRequest,
  fastify: FastifyInstance,
): Promise<GraphQLContext> {
  const prisma = fastify.prisma;
  let userId: string | undefined;
  try {
    await request.jwtVerify();
    userId = (request.user as { sub: string }).sub;
  } catch {
    userId = undefined;
  }
  return { prisma, userId };
}
