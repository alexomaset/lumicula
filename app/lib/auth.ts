import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from '../db';
import { users, accounts, sessions, verificationTokens  } from '../db/schema';


export const authOptions: AuthOptions = {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ],
    session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (token?.id) {
          session.user = {
            ...(session.user || {}),
            id: token.id as string
          };
        }
        console.log('Session Token:', token);
        return session;
      },
    },
    events: {
      async signIn({ user, account }) {
        if (!user.email) {
          throw new Error("Email required for authentication");
        }
      },
      async signOut({ session }) {
        // Clear any additional session data or cookies here
        console.log('User signed out, clearing session data');
      },
    },
  };