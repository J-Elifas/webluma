import type { ComponentProps } from "react";
import InputField from "./InputField";

type EmailInputFieldProps = Omit<ComponentProps<typeof InputField>, "type">;

export default function EmailInputField(props: EmailInputFieldProps) {
    return <InputField type="email" {...props} />;
}
