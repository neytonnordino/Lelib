import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token?.email && session.user) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
