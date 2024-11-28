import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from '../db';
import { users, accounts, sessions, verificationTokens } from '../db/schema';
import { verifyUser } from '../db/queries';


export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            return null;
        }
        
        const user = await verifyUser(credentials.email, credentials.password);
        
        if (user) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password, // Should generally avoid returning password
                emailVerified: user.emailVerified,
                image: user.image,
                role: user.role ?? undefined, // Convert `null` to `undefined`
            };
        }
        return null;
    }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
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
      console.log('User signed out, clearing session data');
    },
  },
  pages: {
    signIn: '/signin',  // Custom sign-in page (optional)
    error: '/auth/error',    // Error page
  },
  debug: process.env.NODE_ENV === 'development',
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
  
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}