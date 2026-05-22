import Logo from "@/components/ui/Logo";

export default function Header() {
    return (
        <header className="mx-auto w-full max-w-7xl px-6 pt-8 md:px-10">
            <Logo width={290} />
        </header>
    );
}
