import * as dotenv from "dotenv";
dotenv.config();

function getEnv(env_name: string) {
  if (typeof process.env[env_name] === "undefined") {
    throw new Error(`Env variable ${env_name} is undefined`);
  }
  return process.env[env_name];
}

export const LOTUS_NODE_URL = getEnv("LOTUS_NODE_URL");
export const LOTUS_ADMIN_AUTH_KEY = getEnv("LOTUS_ADMIN_AUTH_KEY");
export const OPENAI_API_KEY = getEnv("OPENAI_API_KEY");
export const OPENAI_BASE_URL = getEnv("OPENAI_BASE_URL");
