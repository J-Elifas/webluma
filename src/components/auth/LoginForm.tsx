import type { ChangeEventHandler, FormEventHandler, ReactNode } from "react";
import AppleIcon from "@/components/svg/AppleIcon";
import FacebookIcon from "@/components/svg/FacebookIcon";
import GoogleIcon from "@/components/svg/GoogleIcon";
import InputField from "@/components/ui/InputField";
import SectionHeading from "@/components/ui/SectionHeading";

interface OAuthOption {
    name: string;
    icon: ReactNode;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

interface LoginFormProps {
    formValues: LoginFormValues;
    errors: LoginFormErrors;
    formError: string;
    isSubmitting: boolean;
    onFieldChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onOAuthContinue: () => void;
    onGuestContinue: () => void;
}

const oauthOptions: OAuthOption[] = [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Facebook", icon: <FacebookIcon /> },
    { name: "Apple", icon: <AppleIcon /> },
];

export default function LoginForm({
    formValues,
    errors,
    formError,
    isSubmitting,
    onFieldChange,
    onSubmit,
    onOAuthContinue,
    onGuestContinue,
}: LoginFormProps) {
    return (
        <div className="flex flex-col justify-between gap-8 bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="space-y-8">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase text-luma-blue">
                        Workspace login
                    </p>
                    <SectionHeading title="Welcome back" />
                </div>

                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                    <div className="space-y-4">
                        <InputField
                            id="email"
                            name="email"
                            label="Email address"
                            type="email"
                            placeholder="editor@company.com"
                            autoComplete="email"
                            value={formValues.email}
                            onChange={onFieldChange}
                            error={errors.email}
                        />
                        <InputField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={formValues.password}
                            onChange={onFieldChange}
                            error={errors.password}
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="rounded text-sm font-semibold text-luma-blue transition-colors duration-200 hover:text-[#1EA7E4] focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 cursor-pointer"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-luma-blue px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(56,189,248,0.9)] transition-colors duration-200 hover:bg-[#1EA7E4] focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-luma-blue/60"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    {formError ? (
                        <p className="text-center text-sm font-medium text-red-500">{formError}</p>
                    ) : null}
                </form>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-mist-gray" aria-hidden="true" />
                        <span className="text-xs font-medium text-slate-gray">
                            Or Continue With
                        </span>
                        <div className="h-px flex-1 bg-mist-gray" aria-hidden="true" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {oauthOptions.map((option) => (
                            <button
                                key={option.name}
                                type="button"
                                aria-label={`Continue with ${option.name}`}
                                title={`Continue with ${option.name}`}
                                disabled={isSubmitting}
                                onClick={onOAuthContinue}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-mist-gray bg-white px-3 text-xs font-semibold text-midnight-slate shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors duration-200 hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {option.icon}
                                <span className="truncate">{option.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onGuestContinue}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-mist-gray bg-white px-5 py-3 text-sm font-semibold text-midnight-slate transition-colors duration-200 hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                    Continue as guest
                </button>
            </div>
        </div>
    );
}
