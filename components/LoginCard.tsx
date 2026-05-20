import IllustrationPanel from "@/components/IllustrationPanel";
import LoginForm from "@/components/LoginForm";

export default function LoginCard() {
  return (
    <section className="w-full max-w-6xl rounded-[2rem] border border-mist-gray/80 bg-white p-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] md:p-6">
      <div className="grid overflow-hidden rounded-[1.5rem] border border-mist-gray/70 bg-white lg:grid-cols-[1.08fr_0.92fr]">
        <IllustrationPanel />

        <LoginForm />
      </div>
    </section>
  );
}
