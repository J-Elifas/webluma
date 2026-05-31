import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../db/prisma";
import { verifyPassword } from "./password";

function normalizeEmail(email?: string) {
    return email?.trim().toLowerCase() ?? "";
}

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
        updateAge: 5 * 60,
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Email and password",
            credentials: {
                email: {
                    type: "email",
                },
                password: {
                    type: "password",
                },
            },
            async authorize(credentials) {
                const submittedEmail = normalizeEmail(credentials?.email);
                const submittedPassword = credentials?.password ?? "";

                if (!submittedEmail || !submittedPassword) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: submittedEmail,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                    },
                });

                if (!user) {
                    return null;
                }

                const isValidPassword = await verifyPassword(submittedPassword, user.password);

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: "USER",
                };
            },
        }),
        CredentialsProvider({
            id: "guest",
            name: "Guest",
            credentials: {},
            async authorize() {
                return {
                    id: "guest-user",
                    name: "Guest User",
                    email: "guest@example.com",
                    role: "GUEST",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role ?? "USER";
            }

            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id ?? "";
            session.user.role = token.role ?? "USER";

            return session;
        },
    },
};
