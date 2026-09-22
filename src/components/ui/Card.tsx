import { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { useMotionValue, useTransform } from "motion/react";

export type CardProps = ComponentProps<"div"> & {
  tilt?: boolean;
};

/**
 * A surface card with an optional magnetic 3D tilt driven by cursor position.
 * The tilt is only applied on pointer devices and is disabled in reduced motion.
 */
export function Card({ tilt = false, className, children, ...rest }: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(x, [-200, 200], [-6, 6]);
  const rotateY = useTransform(y, [-200, 200], [-6, 6]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!tilt) {
    return (
      <div
        className={cn("bento rounded-[14px]", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bento rounded-[14px] transform-3d",
        "motion-reduce:transform-none",
        className,
      )}
      style={{ perspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <div
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
        className="size-full"
      >
        {children}
      </div>
    </div>
  );
}
