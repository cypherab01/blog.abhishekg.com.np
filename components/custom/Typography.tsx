import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted";

export type TypographyAlign = "left" | "center" | "right" | "justify";

export type TypographyColor = "default" | "muted" | "destructive" | "primary";

interface TypographyProps {
  variant?: TypographyVariant;
  align?: TypographyAlign;
  color?: TypographyColor;
  children: ReactNode;
  className?: string;
}

export function Typography({
  variant = "p",
  align = "left",
  color = "default",
  children,
  className,
}: TypographyProps) {
  const baseStyles: Record<TypographyVariant, string> = {
    h1: "scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance",
    h2: "scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6 max-w-prose",
    blockquote: "mt-6 border-l-2 pl-6 italic text-muted-foreground",
    code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    lead: "text-xl sm:text-2xl leading-relaxed",
    large: "text-lg font-semibold",
    small: "text-sm leading-none font-medium",
    muted: "text-sm",
  };

  const alignClasses: Record<TypographyAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const colorClasses: Record<TypographyColor, string> = {
    default: "",
    muted: "text-muted-foreground",
    destructive: "text-destructive",
    primary: "text-primary",
  };

  const tagMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    blockquote: "blockquote",
    code: "code",
    lead: "p",
    large: "div",
    small: "small",
    muted: "p",
  } as const;

  const Tag = tagMap[variant];

  return (
    <Tag
      className={cn(
        baseStyles[variant],
        alignClasses[align],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Tag>
  );
}

export const H1 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h1" {...props} />
);
export const H2 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h2" {...props} />
);
export const H3 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h3" {...props} />
);
export const H4 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h4" {...props} />
);
export const P = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="p" {...props} />
);
export const Blockquote = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="blockquote" {...props} />
);
export const Code = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="code" {...props} />
);
export const Lead = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="lead" {...props} />
);
export const Large = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="large" {...props} />
);
export const Small = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="small" {...props} />
);
export const Muted = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="muted" {...props} />
);
