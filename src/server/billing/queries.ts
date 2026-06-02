import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";

export async function getBillingData() {
    const session = await getServerSession(authOptions);

    return {
        isGuest: !session || session.user.role === "GUEST",
    };
}
