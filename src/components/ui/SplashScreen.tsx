import React, { useEffect, useState } from 'react';


interface SplashScreenProps {
    onFinish?: () => void;
    duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
    onFinish,
    duration = 1500
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsVisible(false);
                onFinish?.();
            }, 500); // Duration of the fade-out
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#12141D] transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center">
                {/* Static Logo */}
                <div className="mb-6 bg-primary rounded-2xl p-4 shadow-xl shadow-primary/20">
                    <svg width="48" height="48" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M160 144V272C160 289.1 170.9 303.8 186 309.4V400H214V309.4C229.1 303.8 240 289.1 240 272V144H220V240H210V144H190V240H180V144H160ZM310 144V256H280V400H308V144H310ZM310 144C333.2 144 352 162.8 352 186V256H310V144Z" fill="white" />
                    </svg>
                </div>

                {/* Static Text */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Cook<span className="text-primary">Cost</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium mt-2">
                        Professional Food Costing
                    </p>
                </div>
            </div>
        </div>
    );
};
