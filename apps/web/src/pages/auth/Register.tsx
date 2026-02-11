import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock registration logic
        navigate('/');
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col antialiased">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm px-5 pt-12 pb-4 border-b border-white/5 font-display flex items-center gap-4">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate('/login')}
                    className="rounded-full h-10 w-10 border-none bg-white/5 hover:bg-white/10"
                >
                    <Icon name="arrow_back" />
                </Button>
                <h1 className="text-xl font-extrabold tracking-tight">Create Account</h1>
            </header>

            <main className="flex-1 flex flex-col px-5 pt-8 pb-10 gap-10">
                {/* Photo Section */}
                <section className="flex flex-col items-center justify-center gap-4">
                    <div className="relative group cursor-pointer active:scale-95 transition-transform">
                        <div className="w-28 h-28 rounded-full bg-surface-dark border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5 shadow-2xl">
                            <Icon name="person" size="xl" className="text-white/10 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 border-2 border-background-dark ring-4 ring-background-dark">
                            <Icon name="add" size="sm" className="font-bold" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-60">Add Profile Photo</p>
                </section>

                {/* Form Section */}
                <form onSubmit={handleRegister} className="flex flex-col gap-10">
                    <div className="space-y-6">
                        <Input
                            label="Full Name"
                            icon="badge"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="font-bold py-4 rounded-2xl bg-surface-dark border-white/10"
                        />

                        <Input
                            label="Username"
                            icon="alternate_email"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="font-bold py-4 rounded-2xl bg-surface-dark border-white/10"
                        />

                        <div className="space-y-2">
                            <Input
                                label="Secure PIN"
                                icon="lock"
                                type="password"
                                inputMode="numeric"
                                placeholder="••••••"
                                maxLength={6}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                required
                                className="tracking-[0.5em] font-black py-4 rounded-2xl bg-surface-dark border-white/10"
                            />
                            <div className="flex items-start gap-2 mt-2 px-1 opacity-60">
                                <Icon name="info" size="sm" className="text-gray-400 mt-0.5" />
                                <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-tight">
                                    PIN will be used for quick login. Must be 6 digits.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 px-1">
                        <div className="relative flex items-center mt-0.5">
                            <input
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-white/10 bg-surface-dark checked:border-primary checked:bg-primary transition-all focus:ring-primary/50"
                                id="terms"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                required
                            />
                            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                <Icon name="check" size="sm" className="font-bold" />
                            </span>
                        </div>
                        <label className="text-xs text-gray-500 font-bold leading-tight cursor-pointer select-none py-0.5" htmlFor="terms">
                            I agree to the <button type="button" className="text-primary hover:text-primary-dark transition-colors">Terms of Service</button> and <button type="button" className="text-primary hover:text-primary-dark transition-colors">Privacy Policy</button>.
                        </label>
                    </div>

                    <div className="sticky bottom-0 bg-background-dark/95 backdrop-blur-sm -mx-5 px-5 pt-6 pb-8 border-t border-white/5 z-10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                        <Button
                            type="submit"
                            disabled={!agreed || pin.length < 6}
                            className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl transition-all mb-6 bg-primary hover:bg-primary-dark shadow-primary/30"
                        >
                            Complete Registration
                        </Button>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 font-bold">
                                Already have an account?
                                <button
                                    onClick={() => navigate('/login')}
                                    type="button"
                                    className="text-white font-black hover:text-primary transition-colors ml-2 uppercase tracking-tight"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};
