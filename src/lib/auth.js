import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
export const auth = betterAuth({
  database: mongodbAdapter(client.db("kindnest")),
  emailAndPassword: { enabled: true },
  socialProviders: { google: { clientId: process.env.GOOGLE_CLIENT_ID || "x", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "x" } },
  account: {
    // Same email may exist as a password account — let Google sign-in link to
    // it instead of erroring with unable_to_link_account / account_not_linked.
    // (No email verification is configured in this app, so a local account can
    // never be "verified"; Google itself verified the address.)
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
      updateUserInfoOnLink: true, // sync name/photo from Google on link
    },
  },
});
