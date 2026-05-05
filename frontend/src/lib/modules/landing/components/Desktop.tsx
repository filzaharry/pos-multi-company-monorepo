'use client';

import React from 'react';
import Link from 'next/link';
import { FeatureCard } from "@/components/ui/landing/FeatureCard";
import { PricingCard } from "@/components/ui/landing/PricingCard";
import { TestimonialCard } from "@/components/ui/landing/TestimonialCard";
import { ContactForm } from "@/components/ui/landing/ContactForm";
import { NewsCard } from "@/components/ui/landing/NewsCard";
import { Accordion } from "@/components/ui/Accordion";
import { Testimonial, Package, FAQ, News, TNC, Header } from '../types';

interface DesktopProps {
    header: Header | null;
    testimonials: Testimonial[];
    packages: Package[];
    faqs: FAQ[];
    news: News[];
    tnc: TNC | null;
    isLoading: boolean;
}

export const Desktop: React.FC<DesktopProps> = ({ header, testimonials, packages, faqs, news, isLoading }) => {
    const heroTitle = header?.title || "Powerful POS Subscription for Your Business";
    const heroSubtitle = header?.subtitle || "Streamline your retail or hospitality operations with our all-in-one point of sale solution. Manage inventory, sales, and staff effortlessly from any device.";
    const heroImage = header?.image || "/assets/banner.png";

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-32 min-h-[700px] flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="max-w-[1440px] mx-auto px-20 relative z-10 w-full">
                    <div className="max-w-[800px] flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">Evolution of Retail</span>
                            <h1 className="text-white text-7xl font-black leading-[1.1] tracking-tight">
                                {heroTitle.split(' ').slice(0, -2).join(' ')} <br />
                                <span className="text-primary">{heroTitle.split(' ').slice(-2).join(' ')}</span>
                            </h1>
                            <p className="text-gray-300 text-xl font-normal leading-relaxed max-w-[640px]">
                                {heroSubtitle}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                            >
                                Explore Packages
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            {/* <section className="py-12 border-b border-gray-200 dark:border-white/5 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-20">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-[0.2em] mb-10">Trusted by industry leaders worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-20 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="text-xl font-bold dark:text-white/20">PARTNER 1</div>
                        <div className="text-xl font-bold dark:text-white/20">PARTNER 2</div>
                        <div className="text-xl font-bold dark:text-white/20">PARTNER 3</div>
                        <div className="text-xl font-bold dark:text-white/20">PARTNER 4</div>
                    </div>
                </div>
            </section> */}

            {/* Features Section */}
            <section className="py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-4 text-center items-center">
                            <h2 className="text-gray-900 dark:text-white text-4xl font-black tracking-tight max-w-[720px]">
                                Why Choose Our POS?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-normal leading-normal max-w-[600px]">
                                Designed to help your business grow with ease and enterprise-grade security.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                            <FeatureCard
                                icon="rocket_launch"
                                title="Easy Setup"
                                description="Get up and running in minutes with our intuitive interface and automated onboarding flow."
                            />
                            <FeatureCard
                                icon="shield"
                                title="Secure Payments"
                                description="Enterprise-grade encryption and PCI-DSS compliance for every single transaction you process."
                            />
                            <FeatureCard
                                icon="headset_mic"
                                title="24/7 Support"
                                description="Our dedicated success managers are always online to help your business reach its full potential."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="packages" className="py-24 bg-gray-50 dark:bg-background-dark/50">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="text-center mb-16 flex flex-col gap-4">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Flexible Pricing for Every Scale</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Choose the plan that fits your current needs and scale as you grow your empire.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 items-center">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                            ))
                        ) : packages.length > 0 ? (
                            packages.map((pkg, index) => (
                                <PricingCard
                                    key={pkg.id}
                                    title={pkg.name}
                                    price={pkg.pricing.toString()}
                                    isPopular={index === 1}
                                    buttonText={index === 2 ? "Contact Sales" : (index === 1 ? "Get Pro Now" : "Start Free Trial")}
                                    buttonVariant={index === 2 ? "secondary" : (index === 1 ? "primary" : "outline")}
                                    href="/checkout"
                                    features={pkg.description ? pkg.description.split(',').map((f: string) => f.trim()) : []}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500">No packages available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="flex flex-col gap-12">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white">Latest Updates</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">Stay in the loop with our newest features and company news.</p>
                            </div>
                            <button className="text-primary font-bold hover:underline flex items-center">
                                View all news <span className="material-symbols-outlined ml-1">arrow_forward</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                                ))
                            ) : news.length > 0 ? (
                                news.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        title={item.title}
                                        bannerUrl={item.banner_url || "https://picsum.photos/800/400"}
                                        content={item.content}
                                        date={new Date(item.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 text-center text-gray-500">No news available</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50 dark:bg-background-dark/50">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Loved by Retailers</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                            ))
                        ) : testimonials.length > 0 ? (
                            testimonials.map((t, index) => (
                                <TestimonialCard
                                    key={t.id}
                                    name={t.name}
                                    role={t.role || 'Customer'}
                                    avatar={t.avatar}
                                    content={t.content}
                                    delay={index * 0.1}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500">No testimonials available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="max-w-3xl mx-auto flex flex-col gap-12">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need to know about the product and billing.</p>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : faqs.length > 0 ? (
                            <Accordion
                                items={faqs.map((faq) => ({
                                    id: faq.id,
                                    title: faq.title,
                                    content: faq.subtitle
                                }))}
                            />
                        ) : (
                            <div className="text-center text-gray-500">No FAQs available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            {/* <section id="contact" className="py-24 bg-gray-50 dark:bg-background-dark/50">
                <div className="max-w-[1440px] mx-auto px-20">
                    <div className="grid grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                Let&apos;s talk about <br /> your <span className="text-primary">business growth</span>.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                Whether you&apos;re a single boutique or a large chain, our POS solution scales with you. Contact our team for a personalized demo.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    sales@pos-saas.com
                                </div>
                                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    +1 (555) 000-1234
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-black/5">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Call to Action */}
            {/* <section className="py-24 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="max-w-[1440px] mx-auto px-20 relative z-10">
                    <div className="flex flex-col items-center gap-8 text-center text-white">
                        <h2 className="text-5xl font-black tracking-tight max-w-[800px]">Ready to transform your business operations?</h2>
                        <p className="text-white/80 text-xl max-w-[600px]">Join over 50,000+ merchants who have streamlined their workflow with our POS platform.</p>
                        <Link
                            href="/login"
                            className="flex min-w-[200px] h-14 items-center justify-center rounded-lg bg-white text-primary font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/10 mt-4"
                        >
                            Start Your Free Trial
                        </Link>
                    </div>
                </div>
            </section> */}
        </div>
    );
};
