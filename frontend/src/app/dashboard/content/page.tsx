'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    Layout,
    Type,
    Image as ImageIcon,
    Star,
    Box,
    Save,
    Eye,
    Plus,
    Trash2,
    MoveUp,
    MoveDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ContentManagementPage() {
    const [activeSection, setActiveSection] = useState('hero');

    const sections = [
        { id: 'hero', icon: Type, label: 'Header / Hero' },
        { id: 'packages', icon: Box, label: 'Packages' },
        { id: 'testimonials', icon: Star, label: 'Testimonials' },
        { id: 'faq', icon: Layout, label: 'FAQ & Others' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-white text-4xl font-black leading-tight tracking-tight">Content Management</h2>
                        <p className="text-gray-400 text-base font-normal mt-1">Customize your landing page content, visuals, and messaging</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium border border-white/10 transition-all">
                            <Eye className="w-4 h-4" /> Live Preview
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                            <Save className="w-4 h-4" /> Publish Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left group",
                                    activeSection === section.id
                                        ? "bg-primary/10 border-primary/30 text-white"
                                        : "bg-white/5 border-transparent text-gray-500 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <section.icon className={cn("w-5 h-5", activeSection === section.id ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                                <span className="font-bold text-sm tracking-tight">{section.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Editor */}
                    <div className="lg:col-span-3 space-y-6">
                        {activeSection === 'hero' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-background-dark/40 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl space-y-8">
                                <h3 className="text-xl font-black text-white">Hero Section Editor</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Main Headline</label>
                                        <input
                                            type="text"
                                            defaultValue="Powerful POS Subscription for Your Business"
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sub-headline</label>
                                        <textarea
                                            defaultValue="Streamline your sales and inventory management with our all-in-one POS solution."
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Background Image</label>
                                        <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center gap-4 group hover:border-primary/50 transition-all cursor-pointer bg-white/5">
                                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400">Click to upload or drag and drop</p>
                                            <p className="text-[10px] text-gray-600">SVG, PNG, JPG (MAX. 800x400px)</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'testimonials' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white">Customer Testimonials</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold border border-white/10 transition-all">
                                        <Plus className="w-4 h-4" /> Add Testimonial
                                    </button>
                                </div>
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-6 bg-background-dark/40 backdrop-blur-md border border-white/5 rounded-2xl flex gap-6 group hover:border-primary/30 transition-all">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="Author Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                                                <input type="text" placeholder="Position/Company" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary" />
                                            </div>
                                            <textarea placeholder="Testimonial text..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]" />
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-gray-500 hover:text-white"><MoveUp className="w-4 h-4" /></button>
                                            <button className="p-2 text-gray-500 hover:text-white"><MoveDown className="w-4 h-4" /></button>
                                            <button className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {(activeSection === 'packages' || activeSection === 'faq') && (
                            <div className="p-12 text-center bg-white/5 border border-white/5 rounded-3xl">
                                <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                                    <Layout className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Section Under Development</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">This editor module is currently being optimized for high-performance content delivery.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
