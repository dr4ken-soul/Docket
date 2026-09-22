/**
 * A skeleton shimmer used for loading states. No spinners are used in Docket.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={"skeleton".concat(className ? ` ${className}` : "")} />;
}
