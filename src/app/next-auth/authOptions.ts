import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    // Add your authentication providers here

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Implement your authentication logic here
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          },
          );
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message);
          }
          console.log("resulttttttttttt", result);
          const { token, user } = result.data;
          const jwt: { id: string } = jwtDecode(token);
          return {
            id: jwt.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token,
            provider: "credentials",
          };
        } catch (err) {
          throw new Error((err as Error).message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.routeToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        //
        token.provider = account?.provider;

        if (user.accessToken) {
          token.routeToken = user.accessToken;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.id = token.id;
        session.user.role = token.role;
        //
        session.user.provider = token.provider;
      }
      //
      session.routeToken = token.routeToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // NEXTAUTH_SECRET
  secret: process.env.NEXTAUTH_SECRET,
};
