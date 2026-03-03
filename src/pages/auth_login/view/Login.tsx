import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            const { signInWithPopup } = await import('firebase/auth');
            const { auth, googleProvider } = await import('../../../lib/firebase');
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login with Google');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#12141D] font-display text-white min-h-screen flex flex-col px-6 pt-12 pb-10 antialiased justify-center">
            {/* Logo & Branding */}
            <div className="flex flex-col items-center mb-16">
                <div className="mb-6 bg-primary rounded-2xl p-4 shadow-xl shadow-primary/20">
                    <Icon name="restaurant" className="text-white !text-5xl" />
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Cook<span className="text-primary">Cost</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium mt-2">
                        Professional Food Costing
                    </p>
                </div>
            </div>

            {/* Login Action */}
            <div className="flex flex-col gap-6 mt-4">
                {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    variant="secondary"
                    className="h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 bg-[#1C1F2E] text-white hover:bg-white/5 border border-white/5 shadow-xl active:scale-[0.98] group mx-6"
                >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
                    </div>
                    <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </Button>
            </div>

            {/* Subtle Footer Detail */}
            <footer className="fixed bottom-8 left-0 right-0 text-center opacity-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Powered by Antigravity Cloud</p>
            </footer>
        </div>
    );
};
