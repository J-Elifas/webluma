import NextAuth from "next-auth";
import { authOptions } from "@/server/auth/options";

const handller = NextAuth(authOptions);

export { handller as GET, handller as POST };
