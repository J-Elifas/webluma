import type { ComponentProps } from "react";
import InputField from "./InputField";

type TextInputFieldProps = Omit<ComponentProps<typeof InputField>, "type">;

export default function TextInputField(props: TextInputFieldProps) {
    return <InputField type="text" {...props} />;
}
