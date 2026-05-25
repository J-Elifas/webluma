"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm, { type LoginFormErrors, type LoginFormValues } from "@/components/auth/LoginForm";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginFormControllerProps {
    onPendingChange?: (isPending: boolean) => void;
}

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

export default function LoginFormController({ onPendingChange }: LoginFormControllerProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<LoginFormValues>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    function continueToApp() {
        setPendingState(true);
        router.push("/dashboard");
    }

    function showNavigationPending() {
        setPendingState(true);
    }

    function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
        const fieldName = event.target.name as keyof LoginFormValues;
        const { value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));

        setFormError("");
        setErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: undefined,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors = validateLoginForm(formValues);

        setFormError("");
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setPendingState(true);
        let shouldKeepPending = false;

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formValues.email.trim().toLowerCase(),
                password: formValues.password,
            });

            if (!result?.ok || result.error) {
                setFormError("Invalid email or password.");
                return;
            }

            shouldKeepPending = true;
            continueToApp();
            router.refresh();
        } catch {
            setFormError("Unable to log in. Please try again.");
        } finally {
            if (!shouldKeepPending) {
                setPendingState(false);
            }
        }
    }

    return (
        <LoginForm
            formValues={formValues}
            errors={errors}
            formError={formError}
            isSubmitting={isSubmitting}
            guestHref="/dashboard"
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            onOAuthContinue={continueToApp}
            onGuestContinue={showNavigationPending}
        />
    );
}
