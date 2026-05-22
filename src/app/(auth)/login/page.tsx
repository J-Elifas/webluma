import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
    return (
        <div className="app-surface flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center px-4 pb-10 pt-4 md:px-10">
                <LoginCard />
            </main>
            <Footer />
        </div>
    );
}
