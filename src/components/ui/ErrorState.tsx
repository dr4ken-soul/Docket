import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Renders a recoverable failure with a retry action when available. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="error-state" role="alert">
      <p className="eyebrow">Action needed</p>
      <h2>We could not finish that request</h2>
      <p>{message}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </section>
  );
}
