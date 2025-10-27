import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"]
};

export default config;
