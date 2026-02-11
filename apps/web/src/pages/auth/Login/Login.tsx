import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Icon } from '../../../components/ui/Icon';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login logic
        navigate('/');
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col px-6 pt-12 pb-10 antialiased -mx-5 -mt-4">
            <main className="w-full max-w-md mx-auto flex flex-col gap-10 flex-1 justify-center">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-primary rounded-[28px] flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-all duration-500 border border-white/10">
                        <Icon name="restaurant_menu" size="xl" className="text-white font-bold" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-white">CookCost</h1>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] opacity-80">Professional Food Costing</p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-8">
                    <div className="space-y-4">
                        <Input
                            icon="person"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="font-bold py-4 rounded-2xl"
                        />

                        <div className="space-y-2">
                            <Input
                                icon="lock"
                                type="password"
                                inputMode="numeric"
                                placeholder="PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                required
                                className="tracking-[0.5em] font-black py-4 rounded-2xl"
                            />
                            <div className="flex justify-end pr-1">
                                <button type="button" className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                                    Forgot PIN?
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl transition-all"
                    >
                        Login to Account
                    </Button>
                </form>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-bold">
                        Don't have an account?
                        <button
                            onClick={() => navigate('/register')}
                            type="button"
                            className="text-primary font-black hover:text-primary-dark ml-2 transition-colors uppercase tracking-tight"
                        >
                            Register Now
                        </button>
                    </p>
                </div>
            </main>

            {/* Subtle Footer Detail */}
            <footer className="fixed bottom-8 left-0 right-0 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">Powered by Antigravity Cloud</p>
            </footer>
        </div>
    );
};
