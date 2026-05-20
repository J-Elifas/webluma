import type { InputHTMLAttributes } from "react";

type FieldType = "email" | "password" | "text";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  type?: FieldType;
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7.5 7.5 5.6 7.5-5.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.3 12s3.5-5.7 9.7-5.7S21.7 12 21.7 12s-3.5 5.7-9.7 5.7S2.3 12 2.3 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function InputField({
  id,
  label,
  type = "text",
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <label htmlFor={id} className="block text-sm font-semibold text-midnight-slate">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-mist-gray bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(15,23,42,0.02)] focus-within:border-luma-blue">
        <span className="mr-2 text-slate-gray" aria-hidden="true">
          {type === "email" ? <MailIcon /> : <LockIcon />}
        </span>
        <div className="mr-2 h-5 w-px bg-mist-gray" aria-hidden="true" />
        <input
          id={id}
          type={type}
          className="w-full border-0 bg-transparent text-sm text-midnight-slate outline-none placeholder:text-slate-gray/75"
          {...props}
        />
        {type === "password" && (
          <span className="ml-2 text-slate-gray" aria-hidden="true">
            <EyeIcon />
          </span>
        )}
      </div>
    </div>
  );
}
