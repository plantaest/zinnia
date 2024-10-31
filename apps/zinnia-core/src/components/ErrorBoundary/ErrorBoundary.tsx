import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from '@/components/ErrorBoundary/ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
}

type ErrorBoundaryState =
  | {
      hasError: false;
    }
  | {
      hasError: true;
      error: Error;
      errorInfo: ErrorInfo;
    };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}
