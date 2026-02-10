import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

export const Profile: React.FC = () => {
    return (
        <div className="p-6 flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-extrabold">Profile & Settings</h1>
            </header>

            <Card className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    C
                </div>
                <div>
                    <h2 className="font-bold text-lg">Chef User</h2>
                    <p className="text-sm text-text-muted">Pro Plan</p>
                </div>
            </Card>

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide">App Settings</h3>
                <Card hoverEffect className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Icon name="database" className="text-primary" />
                        <span>Backup Data</span>
                    </div>
                    <Icon name="chevron_right" className="text-text-muted" />
                </Card>
                <Card hoverEffect className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Icon name="restore" className="text-primary" />
                        <span>Restore Data</span>
                    </div>
                    <Icon name="chevron_right" className="text-text-muted" />
                </Card>
                <Card hoverEffect className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Icon name="palette" className="text-primary" />
                        <span>Appearance</span>
                    </div>
                    <Icon name="chevron_right" className="text-text-muted" />
                </Card>
            </section>

            <div className="mt-8">
                <Button variant="danger" className="w-full">Log Out</Button>
                <p className="text-center text-xs text-text-muted mt-4">Version 1.0.0</p>
            </div>
        </div>
    );
};
