import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            icon: 'grid_view',
            label: 'Home',
            isActive: location.pathname === '/',
            onClick: () => navigate('/')
        },
        {
            icon: 'restaurant_menu',
            label: 'Recipes',
            isActive: location.pathname.startsWith('/recipes'),
            onClick: () => navigate('/recipes')
        },
        {
            icon: 'receipt_long',
            label: 'Orders',
            isActive: location.pathname.startsWith('/orders'),
            onClick: () => navigate('/orders')
        },
        {
            icon: 'inventory_2',
            label: 'Inventory',
            isActive: location.pathname.startsWith('/ingredients'),
            onClick: () => navigate('/ingredients')
        },
        {
            icon: 'person',
            label: 'Profile',
            isActive: location.pathname.startsWith('/profile'),
            onClick: () => navigate('/profile')
        },
    ];

    return (
        <div className="bg-background-dark min-h-screen pb-20">
            <Outlet />
            <BottomNav items={navItems} />
        </div>
    );
};
