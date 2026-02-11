import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('Thomas Chef');
    const [description, setDescription] = useState('Head Chef at La Bistro.');
    const maxChars = 40;

    const handleSave = () => {
        // Logic to save profile changes would go here
        navigate('/profile');
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-safe">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm px-5 pt-12 pb-4 border-b border-white/5 font-display">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-white active:scale-90"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-extrabold tracking-tight">Edit Profile</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-5 py-8 pb-32 gap-10">
                {/* Avatar Section */}
                <section className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-primary p-1 shadow-2xl relative overflow-visible group">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center overflow-hidden"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh_wtIoQQkw7stwg6_dUbYwzRyj2JDYeuICxZ5vfvLYDunXRddDZNvt_PJrG_5LBOCORVFSs2vBYKeFDEWhZepFLX7ZWPedAVfpfZhov945Uni5JvkmStFuABKLhQ-jD1maP_jIpf9dV49Qk3YtkyQ4eOCI3oI6ttqN3o7anDnjg4eDU9QZ5-rImasTSSrfEkhK6eORC-six3CmewhQiV8-4Vegqbu3ZTOyQ4-03cdyJU69S23LB_zJaVpeqwdHqVOgOadH4CWM')" }}
                            ></div>
                            <button className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background-dark hover:bg-primary-dark transition-all active:scale-95 z-10">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <form className="space-y-6 flex-1" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider" htmlFor="username">Username</label>
                        <div className="relative group">
                            <input
                                className="w-full bg-surface-dark/50 text-gray-600 border border-white/5 rounded-2xl px-5 py-4 outline-none cursor-not-allowed shadow-none font-bold"
                                disabled
                                id="username"
                                readOnly
                                type="text"
                                value="@thomas_chef"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
                                <span className="material-symbols-outlined text-xl">lock</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider" htmlFor="name">Name</label>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-dark text-white border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-white/10 shadow-xl"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider" htmlFor="description">Description</label>
                        <div className="relative">
                            <textarea
                                className="w-full bg-surface-dark text-white border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-white/10 resize-none shadow-xl leading-relaxed h-[6rem]"
                                id="description"
                                maxLength={maxChars}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                            <p className="text-xs text-gray-500 text-right mt-2 font-bold px-1">
                                {description.length}/{maxChars} <span className="text-[10px] uppercase font-black opacity-30 tracking-tight ml-1">characters</span>
                            </p>
                        </div>
                    </div>
                </form>

                {/* Save Button */}
                <div className="mt-auto pt-6">
                    <button
                        onClick={handleSave}
                        className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 mb-8"
                    >
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    );
};
