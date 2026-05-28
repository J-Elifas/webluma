import type { ComponentProps } from "react";
import InputField from "./InputField";

type UrlInputFieldProps = Omit<ComponentProps<typeof InputField>, "type">;

export default function UrlInputField(props: UrlInputFieldProps) {
    return <InputField type="url" {...props} />;
}
