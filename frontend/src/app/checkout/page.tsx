'use client';

import React, { useState } from 'react';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    Shield,
    User,
    CreditCard,
    Building2,
    Wallet,
    CloudUpload,
    Loader2
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function CheckoutPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            company: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
            company: Yup.string().required('Company name is required'),
        }),
        onSubmit: async (values) => {
            setShowConfirmModal(true);
        },
    });

    const handleConfirm = () => {
        setShowConfirmModal(false);
        router.push('/checkout/success');
    };

    return (
        <LandingLayout>
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirm}
                title="Confirm Subscription"
                message="Are you sure you want to proceed with the payment for the Premium Enterprise Plan? This will unlock all premium features for your business."
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-12 flex flex-col gap-8">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary/70 text-sm font-medium">
                        <a className="hover:text-primary transition-colors" href="#">Subscriptions</a>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">Checkout</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mt-2 text-white">Complete your subscription</h1>
                    <p className="text-white/60 text-lg max-w-2xl">
                        Review your plan and enter payment details to unlock the full power of POS Cloud for your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Summary */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="glass-effect rounded-2xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                            <div className="flex gap-6 items-center">
                                <div className="size-20 bg-primary/20 rounded-2xl flex items-center justify-center overflow-hidden border border-primary/30 shrink-0">
                                    <div className="w-full h-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center">
                                        <CheckCircle2 className="text-white w-10 h-10" />
                                    </div>
                                </div>
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl font-bold text-white">Premium Enterprise Plan</h3>
                                    <p className="text-white/40 text-sm font-medium">Billed annually</p>
                                </div>
                                <button className="text-primary text-sm font-bold hover:underline">Change</button>
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-8 text-white/70">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-primary w-5 h-5" />
                                        <span className="text-sm font-medium">24/7 Priority Support</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">Included</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-primary w-5 h-5" />
                                    <span className="text-sm font-medium">Unlimited Transactions</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-primary w-5 h-5" />
                                    <span className="text-sm font-medium">Advanced Real-time Analytics</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Plan Price</span>
                                    <span className="font-bold text-white">$1,200.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Taxes (10%)</span>
                                    <span className="font-bold text-white">$120.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Service Fee</span>
                                    <span className="font-bold text-white">$5.00</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between text-xl font-black">
                                    <span className="text-white">Total Amount</span>
                                    <span className="text-primary">$1,325.00</span>
                                </div>
                            </div>

                            <button
                                onClick={() => formik.handleSubmit()}
                                disabled={formik.isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {formik.isSubmitting ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Proceed to Payment</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="glass-effect rounded-2xl p-6 border-white/5 bg-white/5">
                            <p className="text-sm text-white/40 leading-relaxed flex items-start gap-3">
                                <Shield className="w-5 h-5 text-primary shrink-0" />
                                <span>
                                    Your payment is secured with AES-256 encryption. By continuing, you agree to our Terms of Service and Privacy Policy.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="glass-effect rounded-2xl p-8 border border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <User className="text-primary w-6 h-6" />
                                Business Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Custom animated floating label input simulation */}
                                {[
                                    { id: 'fullName', label: 'Full Name', type: 'text' },
                                    { id: 'email', label: 'Business Email', type: 'email' },
                                    { id: 'phone', label: 'Phone Number', type: 'tel' },
                                    { id: 'company', label: 'Company Name', type: 'text' }
                                ].map((field) => (
                                    <div key={field.id} className="relative group">
                                        <input
                                            id={field.id}
                                            type={field.type}
                                            placeholder=" "
                                            {...formik.getFieldProps(field.id)}
                                            className={cn(
                                                "peer block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-white focus:outline-none focus:ring-0 transition-all",
                                                formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values]
                                                    ? "border-red-500"
                                                    : "border-white/20 focus:border-primary"
                                            )}
                                        />
                                        <label
                                            htmlFor={field.id}
                                            className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-white/40 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary"
                                        >
                                            {field.label}
                                        </label>
                                        {formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values] && (
                                            <p className="text-[10px] text-red-500 mt-1 uppercase font-bold tracking-wider">{formik.errors[field.id as keyof typeof formik.values]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-8 border border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <CreditCard className="text-primary w-6 h-6" />
                                Payment Method
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                {[
                                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                                    { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                                    { id: 'wallet', label: 'e-Wallet', icon: Wallet }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            "relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all group",
                                            paymentMethod === method.id
                                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            className="sr-only"
                                            onClick={() => setPaymentMethod(method.id as any)}
                                        />
                                        <method.icon className={cn(
                                            "w-8 h-8 mb-4 transition-colors",
                                            paymentMethod === method.id ? "text-primary" : "text-white/40 group-hover:text-white"
                                        )} />
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest transition-colors",
                                            paymentMethod === method.id ? "text-white" : "text-white/40 group-hover:text-white"
                                        )}>
                                            {method.label}
                                        </span>
                                        {paymentMethod === method.id && (
                                            <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary" />
                                        )}
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Manual Verification (Optional)</p>
                                <div
                                    className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group relative overflow-hidden"
                                    onClick={() => setIsUploading(true)}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            <p className="text-white font-bold tracking-tight">Processing upload...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-primary/10 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                                <CloudUpload className="w-10 h-10 text-primary" />
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2">Upload Payment Receipt</h4>
                                            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                                                Drag and drop your transfer proof here or <span className="text-primary font-bold">browse files</span>
                                            </p>
                                            <p className="text-white/20 text-xs mt-6">Supports PDF, JPG, PNG up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
