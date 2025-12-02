import { Component, ErrorInfo, ReactNode } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  private animation: AnimationItem | null = null;

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (this.state.hasError && !prevState.hasError) {
      this.animation = lottie.loadAnimation({
        container: document.getElementById("lottie-container")!,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://lottie.host/ebff119c-921c-4611-b261-7e9f5ead20dc/HmbSvNCJRn.json",
      });
    }
  }

  componentWillUnmount() {
    this.animation?.destroy();
  }

  private handleReset = () => {
    this.animation?.destroy();
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500/20 to-emerald-500/30 p-4">
          <div className="max-w-lg w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div
              id="lottie-container"
              className="w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-6"
            ></div>

            <h1 className="text-4xl sm:text-5xl font-bold text-emerald-900 mb-4">
              Oops!
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-800 mb-4">
              Something went wrong
            </h2>
            <p className="my-8 text-emerald-800 max-w-md text-center">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="py-3 px-6 bg-white/50 backdrop-blur-sm border border-white/40 text-emerald-900 font-medium rounded-full hover:bg-white/70 transition-all duration-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;