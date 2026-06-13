'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    RotateCw,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize,
    Minimize,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
}

export const ImagePreview = ({
    isOpen,
    onClose,
    images,
    initialIndex = 0
}: ImagePreviewProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Reset state when the modal opens without using useEffect to avoid cascading renders
    const [prevOpen, setPrevOpen] = useState(isOpen);
    if (isOpen && !prevOpen) {
        setPrevOpen(true);
        setCurrentIndex(initialIndex);
        setScale(1);
        setRotate(0);
    } else if (!isOpen && prevOpen) {
        setPrevOpen(false);
    }

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetTransform();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetTransform();
        }
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotate(prev => (prev + 90) % 360);

    const resetTransform = () => {
        setScale(1);
        setRotate(0);
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(images[currentIndex]);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `receipt-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed', error);
            // Fallback
            window.open(images[currentIndex], '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden select-none">
                    {/* Toolbar */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-[210] bg-linear-to-b from-black/50 to-transparent"
                    >
                        <div className="flex items-center gap-6">
                            <span className="text-white/70 font-mono text-sm     ">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
                            <ToolbarButton onClick={handleZoomOut} icon={ZoomOut} label="Zoom Out" />
                            <ToolbarButton onClick={handleZoomIn} icon={ZoomIn} label="Zoom In" />
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <ToolbarButton onClick={handleRotate} icon={RotateCw} label="Rotate" />
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <ToolbarButton onClick={handleDownload} icon={Download} label="Download" />
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 text-white/50 hover:text-white bg-white/5 hover:bg-red-500/20 rounded-2xl transition-all border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>

                    {/* Main Image Container */}
                    <div className="relative w-full h-full flex items-center justify-center p-12">
                        {images.length > 1 && (
                            <>
                                <NavigationButton
                                    direction="left"
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    icon={ChevronLeft}
                                />
                                <NavigationButton
                                    direction="right"
                                    onClick={handleNext}
                                    disabled={currentIndex === images.length - 1}
                                    icon={ChevronRight}
                                />
                            </>
                        )}

                        <motion.div
                            key={currentIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: scale, rotate: rotate, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative cursor-grab active:cursor-grabbing"
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                        >
                            <img
                                src={images[currentIndex]}
                                alt={`Preview ${currentIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-none"
                            />
                        </motion.div>
                    </div>

                    {/* Bottom Indicator (Thumbnails) */}
                    {images.length > 1 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
                        >
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={cn(
                                        "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                                        currentIndex === idx ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
};

const ToolbarButton = ({ onClick, icon: Icon, label }: { onClick: (e: React.MouseEvent) => void, icon: LucideIcon, label: string }) => (
    <button
        type="button"
        onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}
        title={label}
        className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
    >
        <Icon className="w-5 h-5 group-active:scale-90 transition-transform" />
    </button>
);

const NavigationButton = ({ direction, onClick, disabled, icon: Icon }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean, icon: LucideIcon }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "absolute z-[210] top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-all group disabled:opacity-0 disabled:pointer-events-none",
            direction === 'left' ? "left-8" : "right-8"
        )}
    >
        <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
    </button>
);
