import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useConfigStore } from '../../store/useConfigStore';
import { SplashScreen } from '../ui/SplashScreen';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading, initialize } = useAuthStore();
    const { hasSeenIntro } = useConfigStore();
    const location = useLocation();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        // While checking auth status, we can show the splash screen or a loader
        return <SplashScreen onFinish={() => { }} />;
    }

    if (!user) {
        // If not logged in and never seen intro, send to intro
        if (!hasSeenIntro) {
            return <Navigate to="/intro" replace />;
        }

        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
