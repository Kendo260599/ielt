import React from 'react';
import Spinner from './Spinner';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.22,0-9.655-3.373-11.264-7.936l-6.438,5.037C8.807,40.01,15.79,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.912,35.619,44,29.54,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AppLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
);


interface LoginViewProps {
    onSignIn: () => void;
    onContinueAsGuest: () => void;
    isLoading: boolean;
    error: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onSignIn, onContinueAsGuest, isLoading, error }) => {
    return (
        <div className="flex h-full items-center justify-center animate-fade-in-up">
            <div className="w-full max-w-sm p-8 space-y-6 bg-surface shadow-xl rounded-2xl border border-border">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <AppLogo />
                    </div>
                    <h1 className="text-3xl font-bold text-primary">Chào mừng đến với IELTS Scholar</h1>
                    <p className="mt-2 text-secondary">Đăng nhập để lưu tiến độ hoặc tiếp tục với tư cách khách.</p>
                </div>
                {isLoading ? (
                    <div className="py-8">
                        <Spinner message="Đang đăng nhập..." />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={onSignIn}
                            className="w-full flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-lg border border-border bg-surface text-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors"
                        >
                            <GoogleIcon />
                            Đăng nhập với Google
                        </button>
                        <button
                            onClick={onContinueAsGuest}
                            className="w-full flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-lg border border-transparent bg-surface-muted text-secondary hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors"
                        >
                            Tiếp tục với tư cách Khách
                        </button>
                        {error && (
                            <div 
                                className="text-sm text-left text-error p-4 bg-error/10 rounded-lg border border-error/20"
                                dangerouslySetInnerHTML={{ __html: error }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginView;