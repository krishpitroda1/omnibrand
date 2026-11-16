"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { captureException } from "@/lib/observability/sentry";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, { componentStack: errorInfo.componentStack });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex flex-col items-center justify-center text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Application Runtime Error</h3>
            <p className="text-xs text-rose-200 mt-1 max-w-md">
              {this.state.error?.message || "An unexpected error occurred. Incident logged to telemetry."}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span>Attempt Recovery</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
