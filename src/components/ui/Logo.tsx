import WeblumaWordmark from "@/components/svg/WeblumaWordmark";

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function Logo({ width = 340, height = 92, className }: LogoProps) {
    return <WeblumaWordmark width={width} height={height} className={className} />;
}
