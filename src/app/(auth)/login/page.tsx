import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { authOptions } from "@/server/auth/options";
import LoginPageController from "./LoginPageController";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="app-surface flex min-h-screen flex-col">
            <Header />
            <LoginPageController />
            <Footer />
        </div>
    );
}
