import type { ComponentProps } from "react";
import InputField from "./InputField";

type NumberInputFieldProps = Omit<ComponentProps<typeof InputField>, "type">;

export default function NumberInputField(props: NumberInputFieldProps) {
    return <InputField type="number" {...props} />;
}
