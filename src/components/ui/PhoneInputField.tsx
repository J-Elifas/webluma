import type { ComponentProps } from "react";
import InputField from "./InputField";

type PhoneInputFieldProps = Omit<ComponentProps<typeof InputField>, "type">;

export default function PhoneInputField(props: PhoneInputFieldProps) {
    return <InputField type="tel" {...props} />;
}
