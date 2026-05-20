"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import InputField from "@/components/InputField";
import SectionHeading from "@/components/SectionHeading";

interface OAuthOption {
    name: string;
    icon: ReactNode;
}

interface LoginFormValues {
    email: string;
    password: string;
}

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm({ email, password }: LoginFormValues) {
    const errors: LoginFormErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        errors.email = "Enter your email address.";
    } else if (!emailPattern.test(trimmedEmail)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
        errors.password = "Enter your password.";
    }

    return errors;
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.4h3.2c1.9-1.7 3-4.2 3-7.1Z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.6-2.6l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.5A10 10 0 0 0 12 22Z"
            />
            <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.7H3.1a10 10 0 0 0 0 8.9l3.3-2.8Z" />
            <path
                fill="#EA4335"
                d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 12 2a10 10 0 0 0-8.9 5.7l3.3 2.5C7.2 7.9 9.4 6.1 12 6.1Z"
            />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#1877F2" />
            <path
                fill="#FFFFFF"
                d="M14.8 12.6h-2v6h-2.5v-6H8.9v-2.2h1.4V9c0-1.8 1.1-2.9 3-2.9.8 0 1.6.1 1.6.1v1.9H14c-.9 0-1.2.5-1.2 1.1v1.2h2l-.3 2.2Z"
            />
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                fill="currentColor"
                d="M16.5 13c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.2-2.6-.1-.1-2.6-1-2.6-3.5ZM14.3 6.2c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.9-1 2.9 1 .1 2-.5 2.7-1.3Z"
            />
        </svg>
    );
}

const oauthOptions: OAuthOption[] = [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Facebook", icon: <FacebookIcon /> },
    { name: "Apple", icon: <AppleIcon /> },
];

export default function LoginForm() {
    const router = useRouter();
    const [formValues, setFormValues] = useState<LoginFormValues>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});

    function continueToApp() {
        router.push("/app");
    }

    function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
        const fieldName = event.target.name as keyof LoginFormValues;
        const { value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: undefined,
        }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors = validateLoginForm(formValues);

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        continueToApp();
    }

    return (
        <div className="flex flex-col justify-between gap-8 bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="space-y-8">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase text-luma-blue">
                        Workspace login
                    </p>
                    <SectionHeading title="Welcome back" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-4">
                        <InputField
                            id="email"
                            name="email"
                            label="Email address"
                            type="email"
                            placeholder="editor@company.com"
                            autoComplete="email"
                            value={formValues.email}
                            onChange={handleFieldChange}
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
                            onChange={handleFieldChange}
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
                        className="inline-flex w-full items-center justify-center rounded-xl bg-luma-blue px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(56,189,248,0.9)] transition-colors duration-200 hover:bg-[#1EA7E4] focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2"
                    >
                        Login
                    </button>
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
                                onClick={continueToApp}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-mist-gray bg-white px-3 text-xs font-semibold text-midnight-slate shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors duration-200 hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 cursor-pointer"
                            >
                                {option.icon}
                                <span className="truncate">{option.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <ButtonLink href="/app" variant="secondary">
                    Continue as guest
                </ButtonLink>
            </div>
        </div>
    );
}
