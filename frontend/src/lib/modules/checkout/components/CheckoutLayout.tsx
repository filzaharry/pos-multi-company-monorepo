'use client';

import { LandingLayout } from '@/components/layout/LandingLayout';
import { cn } from '@/lib/utils';
import { useFormik } from 'formik';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronRight,
    CloudUpload,
    CreditCard,
    Loader2,
    Shield,
    User,
    Wallet
} from 'lucide-react';
import { useState, useRef } from 'react';
import * as Yup from 'yup';

import { BaseModal } from '@/components/ui/modal/BaseModal';
import { useRouter } from 'next/navigation';
import { apiRouter } from '@/lib/api/router';

export const CheckoutLayout = () => {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmittingApi, setIsSubmittingApi] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            company: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Nama lengkap wajib diisi'),
            email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
            phone: Yup.string().required('Nomor telepon wajib diisi'),
            company: Yup.string().required('Nama perusahaan wajib diisi'),
        }),
        onSubmit: async (values) => {
            if (!selectedFile) {
                window.dispatchEvent(new CustomEvent('app:toast', {
                    detail: { message: 'Silakan unggah bukti transfer pembayaran terlebih dahulu.', type: 'error' }
                }));
                return;
            }
            setShowConfirmModal(true);
        },
    });

    const handleConfirm = async () => {
        if (!selectedFile) {
            window.dispatchEvent(new CustomEvent('app:toast', {
                detail: { message: 'Silakan unggah bukti transfer pembayaran terlebih dahulu.', type: 'error' }
            }));
            setShowConfirmModal(false);
            return;
        }

        setIsSubmittingApi(true);
        setShowConfirmModal(false);

        try {
            const formData = new FormData();
            formData.append('full_name', formik.values.fullName);
            formData.append('business_email', formik.values.email);
            formData.append('phone_number', formik.values.phone);
            formData.append('company_name', formik.values.company);
            formData.append('package_id', '3'); // ID 3 is Enterprise Package
            formData.append('payment_method', paymentMethod === 'bank' ? '0' : '1');
            formData.append('payment_upload', selectedFile);

            await apiRouter.upload('/auth/register', formData);

            window.dispatchEvent(new CustomEvent('app:toast', {
                detail: { message: 'Pengajuan berlangganan berhasil dikirim!', type: 'success' }
            }));

            router.push('/checkout/success');
            // eslint-disable-next-line
        } catch (error: any) {
            console.error('Checkout failed:', error);
            // Error is handled automatically by axios interceptor toast,
            // but we can still redirect or let user try again
        } finally {
            setIsSubmittingApi(false);
        }
    };

    // const handleFailed = () => {
    //     setShowConfirmModal(false);
    //     router.push('/checkout/failed');
    // };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                window.dispatchEvent(new CustomEvent('app:toast', {
                    detail: { message: 'Ukuran file bukti transfer maksimal 5MB.', type: 'error' }
                }));
                return;
            }
            setSelectedFile(file);
        }
    };

    return (
        <LandingLayout>
            <BaseModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Pilih Hasil Pembayaran"
                size="md"
                className="bg-white border border-slate-200 text-slate-900 rounded-3xl"
                showCloseButton={true}
                footer={
                    <div className="flex w-full justify-end items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowConfirmModal(false)}
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <div className="flex">
                            {/* <button
                                type="button"
                                onClick={handleFailed}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md cursor-pointer"
                            >
                                Simulasi Gagal
                            </button> */}
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="px-5 py-2.5 text-sm font-bold text-white btn-green hover:bg-primary-dark rounded-xl transition-all shadow-md cursor-pointer"
                            >
                                Proses & Bayar
                            </button>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center py-4 bg-white text-slate-900">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Simulasikan Transaksi Anda</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        {"Klik 'Proses & Bayar' untuk mengirim data pengajuan langganan ke sistem backend dan mengirimkan email konfirmasi."}
                    </p>
                </div>
            </BaseModal>

            <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-12 flex flex-col gap-8 bg-white text-slate-900">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <a className="hover:text-primary transition-colors" href="#">Langganan</a>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 font-semibold">Checkout</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mt-2 text-slate-900">Selesaikan Langganan Anda</h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        Tinjau paket Anda dan masukkan detail pembayaran untuk mengaktifkan seluruh kekuatan POS Cloud bagi bisnis Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Summary */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="bg-white border border-slate-200/80 shadow-lg rounded-2xl p-8 flex flex-col gap-8 relative overflow-hidden">
                            <div className="flex gap-6 items-center">
                                <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden border border-primary/20 shrink-0">
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                        <CheckCircle2 className="text-white w-10 h-10" />
                                    </div>
                                </div>
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl font-bold text-slate-900">Paket Premium Enterprise</h3>
                                    <p className="text-slate-500 text-sm font-medium">Ditagih tahunan</p>
                                </div>
                                <button className="text-primary text-sm font-bold hover:underline">Ubah</button>
                            </div>

                            <div className="space-y-4 border-t border-slate-100 pt-8 text-slate-600">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-primary w-5 h-5" />
                                        <span className="text-sm font-medium">Dukungan Prioritas 24/7</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">Termasuk</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-primary w-5 h-5" />
                                    <span className="text-sm font-medium">Transaksi Tanpa Batas</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-primary w-5 h-5" />
                                    <span className="text-sm font-medium">Analitik Real-time Lanjutan</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Harga Paket</span>
                                    <span className="font-bold text-slate-900">Rp 18.000.000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Pajak (11%)</span>
                                    <span className="font-bold text-slate-900">Rp 1.980.000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Biaya Layanan</span>
                                    <span className="font-bold text-slate-900">Rp 75.000</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-xl font-black">
                                    <span className="text-slate-900">Total Pembayaran</span>
                                    <span className="text-primary">Rp 20.055.000</span>
                                </div>
                            </div>

                            <button
                                onClick={() => formik.handleSubmit()}
                                disabled={formik.isSubmitting || isSubmittingApi}
                                className="w-full btn-green hover:bg-primary/95 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                            >
                                {isSubmittingApi ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Lanjutkan ke Pembayaran</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
                            <p className="text-sm text-slate-500 leading-relaxed flex items-start gap-3">
                                <Shield className="w-5 h-5 text-primary shrink-0" />
                                <span>
                                    Pembayaran Anda diamankan dengan enkripsi AES-256. Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="bg-white border border-slate-200/80 shadow-lg rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <User className="text-primary w-6 h-6" />
                                Informasi Bisnis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { id: 'fullName', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap Anda' },
                                    { id: 'email', label: 'Email Bisnis', type: 'email', placeholder: 'contoh@perusahaan.com' },
                                    { id: 'phone', label: 'Nomor Telepon', type: 'tel', placeholder: 'Contoh: 081234567890' },
                                    { id: 'company', label: 'Nama Perusahaan', type: 'text', placeholder: 'Masukkan Nama Perusahaan Anda' }
                                ].map((field) => (
                                    <div key={field.id} className="flex flex-col gap-2">
                                        <label
                                            htmlFor={field.id}
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.id}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            {...formik.getFieldProps(field.id)}
                                            className={cn(
                                                "w-full rounded-xl border px-4 py-3 text-sm text-slate-900 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary focus:outline-none transition-all",
                                                formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values]
                                                    ? "border-red-500"
                                                    : "focus:ring-2 focus:ring-primary/20"
                                            )}
                                        />
                                        {formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values] && (
                                            <p className="text-[11px] text-red-500 font-medium mt-1">{formik.errors[field.id as keyof typeof formik.values]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-lg rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <CreditCard className="text-primary w-6 h-6" />
                                Metode Pembayaran
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                {[
                                    { id: 'card', label: 'Kartu Kredit', icon: CreditCard },
                                    { id: 'bank', label: 'Transfer Bank', icon: Building2 },
                                    { id: 'wallet', label: 'Dompet Digital', icon: Wallet }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            "relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all group",
                                            paymentMethod === method.id
                                                ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                                                : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            className="sr-only"
                                            onClick={() => setPaymentMethod(method.id)}
                                            defaultChecked={paymentMethod === method.id}
                                        />
                                        <method.icon className={cn(
                                            "w-8 h-8 mb-4 transition-colors",
                                            paymentMethod === method.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                                        )} />
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest transition-colors",
                                            paymentMethod === method.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
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
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Unggah Bukti Transfer</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                />
                                <div
                                    className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/50 hover:border-primary/50 transition-all group relative overflow-hidden"
                                    onClick={handleUploadClick}
                                >
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-primary/10 p-5 rounded-full mb-2">
                                                <CheckCircle2 className="w-10 h-10 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">{selectedFile.name}</h4>
                                            <p className="text-slate-500 text-sm">Ukuran: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                className="text-red-500 hover:text-red-700 text-sm font-bold mt-2 cursor-pointer"
                                            >
                                                Hapus Bukti
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-primary/10 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                                <CloudUpload className="w-10 h-10 text-primary" />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">Unggah Bukti Transfer</h4>
                                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                                                Seret & taruh bukti transfer Anda di sini atau <span className="text-primary font-bold">cari file</span>
                                            </p>
                                            <p className="text-slate-400 text-xs mt-6">Format yang didukung: PDF, JPG, PNG hingga 5MB</p>
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
};
