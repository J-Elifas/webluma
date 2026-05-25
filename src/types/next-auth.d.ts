import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

export type AuthRole = "USER" | "ADMIN" | "GUEST";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: AuthRole;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role?: AuthRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: AuthRole;
    }
}
