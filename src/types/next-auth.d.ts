import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    accessToken: string;
    role: string;
    provider?: string;
  }

  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      role: string;
      provider?: string;
    };
    id: string;
    routeToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    routeToken: string;
    id: string;
    role: string;
    provider?: string;
  }
}