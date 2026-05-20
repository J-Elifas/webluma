import ButtonLink from "@/components/ButtonLink";
import IllustrationPanel from "@/components/IllustrationPanel";
import InputField from "@/components/InputField";
import SectionHeading from "@/components/SectionHeading";

export default function LoginCard() {
  return (
    <section className="w-full max-w-6xl rounded-[2rem] border border-mist-gray/80 bg-white p-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] md:p-6">
      <div className="grid overflow-hidden rounded-[1.5rem] border border-mist-gray/70 bg-white lg:grid-cols-[1.08fr_0.92fr]">
        <IllustrationPanel />

        <div className="flex flex-col justify-between gap-8 bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="space-y-6">
            <SectionHeading
              title="Login"
              subtitle="Enter any email and password, then continue to the app."
            />

            <div className="space-y-4">
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="daniel2lfisher@gmail.com"
              />
              <InputField
                id="password"
                label="Password"
                type="password"
                placeholder="********"
              />
            </div>

            <p className="text-right text-sm text-slate-gray">
              Forgot password?{" "}
              <span className="font-medium text-luma-blue">Not needed for this demo</span>
            </p>

            <div className="space-y-3">
              <ButtonLink href="/app">Login</ButtonLink>
              <ButtonLink href="/app" variant="secondary">
                Guest Login
              </ButtonLink>
            </div>
          </div>

          <p className="text-center text-sm text-slate-gray">
            No account setup required in this phase.
          </p>
        </div>
      </div>
    </section>
  );
}
