import { Component, ReactNode } from "react";

export interface ErrorBoundaryProps {
  /** Optional label describing where the boundary is scoped. */
  label?: string;
  /** Render function for the error fallback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Runtime error boundary with retry and return-home actions. Surfaces a
 * product-friendly fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const fallback = this.props.fallback?.(error, this.reset);
    if (fallback) return <>{fallback}</>;
    return (
      <div className="error-state">
        <h2>Something went wrong</h2>
        <p className="eyebrow">{this.props.label ?? "Workspace error"}</p>
        <p className="mt-2 max-w-[48ch] text-sm text-[var(--text-secondary)]">
          {error.message}
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="button-primary"
            onClick={this.reset}
          >
            Try again
          </button>
          <a href="/" className="button-secondary">
            Return home
          </a>
        </div>
      </div>
    );
  }
}
