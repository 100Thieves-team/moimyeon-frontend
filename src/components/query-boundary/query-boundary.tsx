"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Component, Suspense, type ComponentType, type ReactNode } from "react";

type ErrorFallbackProps = {
  retry: () => void;
};

type ErrorBoundaryProps<TFallbackProps extends object> = {
  children: ReactNode;
  fallback: ComponentType<TFallbackProps & ErrorFallbackProps>;
  fallbackProps: TFallbackProps;
  onReset: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary<TFallbackProps extends object> extends Component<
  ErrorBoundaryProps<TFallbackProps>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  private retry = () => {
    this.props.onReset();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;

      return <Fallback {...this.props.fallbackProps} retry={this.retry} />;
    }

    return this.props.children;
  }
}

type QueryBoundaryProps<TFallbackProps extends object> = {
  children: ReactNode;
  errorFallback: ComponentType<TFallbackProps & ErrorFallbackProps>;
  errorFallbackProps: TFallbackProps;
  pendingFallback: ReactNode;
};

export function QueryBoundary<TFallbackProps extends object>({
  children,
  errorFallback,
  errorFallbackProps,
  pendingFallback,
}: QueryBoundaryProps<TFallbackProps>) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary fallback={errorFallback} fallbackProps={errorFallbackProps} onReset={reset}>
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
