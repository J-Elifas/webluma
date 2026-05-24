import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LoginCard from "@/components/auth/LoginCard";
import { authOptions } from "@/server/auth/options";
import LoginFormController from "./LoginFormController";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="app-surface flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center px-4 pb-10 pt-4 md:px-10">
                <LoginCard>
                    <LoginFormController />
                </LoginCard>
            </main>
            <Footer />
        </div>
    );
}
