import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
export const auth = betterAuth({
  database: mongodbAdapter(client.db("kindnest")),
  emailAndPassword: { enabled: true },
  socialProviders: { github: { clientId: process.env.GITHUB_CLIENT_ID || "x", clientSecret: process.env.GITHUB_CLIENT_SECRET || "x" } },
});
