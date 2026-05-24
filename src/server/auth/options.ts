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
                };
            },
        }),
    ],
};
