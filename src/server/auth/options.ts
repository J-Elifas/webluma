import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../db/prisma";

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
                    throw new Error("Invalid email or password!");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: submittedEmail,
                    },
                });

                console.log(user);

                return {
                    id: "webluma-credentials-user",
                    email: submittedEmail,
                };
            },
        }),
    ],
};
