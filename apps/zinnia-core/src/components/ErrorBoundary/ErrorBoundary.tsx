import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from '@/components/ErrorBoundary/ErrorFallback';

interface Props {
  children: ReactNode;
}

type State =
  | {
      hasError: false;
    }
  | {
      hasError: true;
      error: Error;
      errorInfo: ErrorInfo;
    };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
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
