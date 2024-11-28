// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    password?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      password?: string; // Only for credentials provider
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
