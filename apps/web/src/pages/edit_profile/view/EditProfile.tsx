import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import { compressImage } from '../../../utils/imageUtils';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Badge } from '../../../components/ui/Badge';

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, updateProfile } = useProfileStore();
    const [name, setName] = useState(profile.name);
    const [description, setDescription] = useState(profile.description);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const maxChars = 40;

    const isDirty = useMemo(() => {
        return name !== profile.name ||
            description !== profile.description ||
            avatarUrl !== profile.avatar;
    }, [name, description, avatarUrl, profile]);

    const isSavingRef = useRef(false);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            !isSavingRef.current &&
            isDirty &&
            currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            try {
                // Resize profile photo to max 150x150, 60% quality WebP
                const compressedBase64 = await compressImage(file, 150, 0.6);
                setAvatarUrl(compressedBase64);
            } catch (error) {
                console.error("Failed to compress image", error);
            }
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        isSavingRef.current = true;
        updateProfile({ name, description, avatar: avatarUrl });
        navigate('/profile');
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-safe">
            <Header
                title="Edit Profile"
                showBackButton
                rightElement={isDirty && (
                    <Badge
                        variant="warning"
                        rounded="full"
                        className="animate-pulse tracking-widest"
                    >
                        Unsaved
                    </Badge>
                )}
            />

            <main className="flex-1 flex flex-col px-5 py-8 pb-32 gap-10">
                {/* Avatar Section */}
                <section className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-primary p-1 shadow-2xl relative overflow-visible group">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center overflow-hidden"
                                style={{ backgroundImage: `url('${avatarUrl}')` }}
                            ></div>
                            <button
                                onClick={handleEditClick}
                                className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background-dark hover:bg-primary-dark transition-all active:scale-95 z-10"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <form className="space-y-6 flex-1" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Username</label>
                        <div className="relative group">
                            <input
                                className="w-full bg-surface-dark/50 text-gray-600 border border-white/5 rounded-2xl px-5 py-4 outline-none cursor-not-allowed shadow-none font-bold"
                                disabled
                                id="username"
                                readOnly
                                type="text"
                                value={`@${profile.username}`}
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
                                <span className="material-symbols-outlined text-xl">lock</span>
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                    />

                    <div className="space-y-2">
                        <Textarea
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={maxChars}
                            rows={3}
                            placeholder="A short bio..."
                        />
                        <p className="text-xs text-gray-500 text-right mt-2 font-bold px-1">
                            {description.length}/{maxChars} <span className="text-[10px] uppercase font-black opacity-30 tracking-tight ml-1">characters</span>
                        </p>
                    </div>
                </form>
            </main>

            <ActionFooter
                className="bottom-0"
                primaryAction={{
                    label: 'Save Changes',
                    onClick: handleSave,
                    isDisabled: !name.trim()
                }}
            />

            <AlertDialog
                isOpen={blocker.state === 'blocked'}
                title="Discard Changes?"
                message="You have unsaved changes to your profile. If you leave now, these changes will be lost."
                confirmLabel="Discard"
                cancelLabel="Keep Editing"
                isDestructive
                onCancel={() => blocker.state === 'blocked' && blocker.reset()}
                onConfirm={() => {
                    if (blocker.state === 'blocked') {
                        blocker.proceed();
                    }
                }}
            />
        </div>
    );
};
