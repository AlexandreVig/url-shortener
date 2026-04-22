import type { ElementType, HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    as: {
      p: "font-sans text-base",
      li: "font-sans text-base",
      a: "font-sans text-base hover:underline underline-offset-2 decoration-primary",
      h1: "font-head text-4xl lg:text-5xl font-bold",
      h2: "font-head text-3xl lg:text-4xl font-semibold",
      h3: "font-head text-2xl font-medium",
      h4: "font-head text-xl font-normal",
      h5: "font-head text-lg font-normal",
      h6: "font-head text-base font-normal",
    },
  },
  defaultVariants: {
    as: "p",
  },
});

interface TextProps
  extends Omit<HTMLAttributes<HTMLElement>, "className">,
    VariantProps<typeof textVariants> {
  className?: string;
}

export const Text = (props: TextProps) => {
  const { className, as, ...otherProps } = props;
  const Tag: ElementType = as || "p";

  return (
    <Tag className={cn(textVariants({ as }), className)} {...otherProps} />
  );
};