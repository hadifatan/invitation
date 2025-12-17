import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
                    <Card className="w-full max-w-md border-destructive/50">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="flex justify-center">
                                <AlertCircle className="h-12 w-12 text-destructive" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                            <p className="text-muted-foreground text-sm">
                                {this.state.error?.message || "An unexpected error occurred"}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
