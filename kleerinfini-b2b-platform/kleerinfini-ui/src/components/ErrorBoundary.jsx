import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-red-100">
                        <h1 className="text-2xl font-black text-red-600 mb-4 uppercase tracking-wide">
                            Une erreur est survenue
                        </h1>
                        <p className="text-gray-600 mb-6 font-medium">
                            L'application a rencontré un problème inattendu.
                        </p>
                        <div className="bg-gray-900 text-red-300 p-4 rounded-lg overflow-auto text-xs font-mono mb-6 max-h-64">
                            <p className="mb-2 font-bold text-white">{this.state.error && this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors"
                        >
                            Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
