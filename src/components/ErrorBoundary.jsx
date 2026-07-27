import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-red-200">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p className="text-sm opacity-80">
            {this.state.error?.message || "An unexpected error occurred while rendering this section."}
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
