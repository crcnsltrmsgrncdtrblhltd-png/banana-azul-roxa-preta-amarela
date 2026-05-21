import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "amarelo" | "verde" | "azul" | "escuro" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  amarelo: "bg-amarelo text-escuro-900 hover:bg-amarelo-escuro",
  verde: "bg-verde text-white hover:bg-verde-escuro",
  azul: "bg-azul text-white hover:bg-azul-escuro",
  escuro: "bg-escuro text-white hover:bg-escuro-900",
  outline: "border border-escuro/30 text-escuro hover:bg-escuro hover:text-white",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded font-display font-medium uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "children" | "className"
    > {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "amarelo", size = "md", className, children } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
