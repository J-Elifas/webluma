import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoginCard from "@/components/LoginCard";

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
