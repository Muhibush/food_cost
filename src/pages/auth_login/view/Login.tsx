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
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col px-6 pt-12 pb-10 antialiased -mx-5 -mt-4 justify-center">
            {/* Logo & Branding */}
            <div className="flex flex-col items-center gap-4 mb-16">
                <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/20 border border-white/10">
                    <Icon name="restaurant_menu" size="xl" className="text-white font-bold scale-150" />
                </div>
                <div className="text-center mt-4">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">CookCost</h1>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Professional Food Costing</p>
                </div>
            </div>

            {/* Login Action */}
            <div className="flex flex-col gap-6 mt-8">
                {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-6 h-6" />
                    {isLoading ? 'Connecting...' : 'Continue with Google'}
                </Button>
            </div>

            {/* Subtle Footer Detail */}
            <footer className="fixed bottom-8 left-0 right-0 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">Powered by Antigravity Cloud</p>
            </footer>
        </div>
    );
};
