
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { IconUser, IconCheckCircle } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const { mockLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            // Sign Up Flow
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                setSignUpSuccess(true);
                setLoading(false);
            }
        } else {
            // Sign In Flow
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                onLoginSuccess();
            }
        }
    };

    const handleMockLogin = (email: string, role: 'admin' | 'faculty') => {
        mockLogin(email, role);
        onLoginSuccess();
    };

    if (signUpSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-500 mb-6">
                        Please check your email to confirm your account. Once confirmed, you can log in.
                    </p>
                    <button
                        onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }}
                        className="text-bits-blue font-bold hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-bits-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconUser className="w-8 h-8 text-bits-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-gray-500 mt-2">{isSignUp ? 'Set up your password to access the portal' : 'Sign in to access the portal'}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {!isSignUp && (
                        <>
                            <button
                                onClick={async () => {
                                    const { error } = await supabase.auth.signInWithOAuth({
                                        provider: 'google',
                                        options: {
                                            redirectTo: window.location.origin
                                        }
                                    });
                                    if (error) setError(error.message);
                                }}
                                className="w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                Sign in with Google
                            </button>

                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-gray-200 w-full absolute"></div>
                                <span className="bg-white px-3 text-xs text-gray-400 font-medium relative z-10 uppercase tracking-wider">Or continue with email</span>
                            </div>
                        </>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bits-blue focus:border-transparent outline-none transition-all"
                                placeholder="you@bits-pilani.ac.in"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bits-blue focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-bits-blue text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                            className="text-sm text-bits-blue font-semibold hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : 'Need to set a password? Sign Up'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-400 mb-4 uppercase tracking-wider font-bold">Development Access (Bypass Auth)</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleMockLogin('test_admin_bits_prep@gmail.com', 'admin')}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded transition-colors"
                        >
                            Login as Admin
                        </button>
                        <button
                            onClick={() => handleMockLogin('test_faculty@example.com', 'faculty')}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded transition-colors"
                        >
                            Login as Faculty
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Protected by Supabase Auth. <br />
                    Only authorized faculty and admins can access restricted areas.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
