import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-sky p-8 text-center">
          <div className="text-8xl mb-6">🐰</div>
          <p className="text-2xl font-bold text-brown-dark mb-4">
            小动物迷路了
          </p>
          <button
            className="touch-target px-8 py-4 bg-yellow-bright text-brown-dark rounded-2xl font-bold text-xl shadow-lg active:scale-95"
            onClick={this.handleRetry}
          >
            点这里重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
