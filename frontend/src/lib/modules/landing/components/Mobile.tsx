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

interface MobileProps {
    header: Header | null;
    testimonials: Testimonial[];
    packages: Package[];
    faqs: FAQ[];
    news: News[];
    tnc: TNC | null;
    isLoading: boolean;
}

export const Mobile: React.FC<MobileProps> = ({ header, testimonials, packages, faqs, news, isLoading }) => {
    const heroTitle = header?.title || "Powerful POS Subscription";
    const heroSubtitle = header?.subtitle || "Streamline your retail or hospitality operations with our all-in-one point of sale solution.";
    const heroImage = header?.image || "/assets/banner.png";

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 min-h-[500px] flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col gap-8 text-center">
                        <div className="flex flex-col gap-4 items-center">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">Evolution of Retail</span>
                            <h1 className="text-white text-5xl font-black leading-[1.1] tracking-tight">
                                {heroTitle.split(' ').slice(0, -1).join(' ')} <br />
                                <span className="text-primary">{heroTitle.split(' ').slice(-1).join(' ')}</span>
                            </h1>
                            <p className="text-gray-300 text-lg font-normal leading-relaxed max-w-[640px]">
                                {heroSubtitle}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 items-center">
                            <button
                                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full max-w-[280px] flex cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold transition-all hover:bg-primary/90 active:scale-95"
                            >
                                Explore Packages
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            {/* <section className="py-12 border-b border-gray-200 dark:border-white/5 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-6">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mb-8">Trusted globally</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        <div className="text-lg font-bold dark:text-white/20">PARTNER 1</div>
                        <div className="text-lg font-bold dark:text-white/20">PARTNER 2</div>
                        <div className="text-lg font-bold dark:text-white/20">PARTNER 3</div>
                    </div>
                </div>
            </section> */}

            {/* Features Section */}
            <section className="py-16 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3 text-center items-center">
                            <h2 className="text-gray-900 dark:text-white text-3xl font-black tracking-tight">
                                Why Choose Our POS?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                                Designed to help your business grow with enterprise-grade security.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <FeatureCard
                                icon="rocket_launch"
                                title="Easy Setup"
                                description="Get up and running in minutes with our automated onboarding flow."
                            />
                            <FeatureCard
                                icon="shield"
                                title="Secure Payments"
                                description="Enterprise-grade encryption and PCI-DSS compliance."
                            />
                            <FeatureCard
                                icon="headset_mic"
                                title="24/7 Support"
                                description="Dedicated success managers always online to help."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="packages" className="py-16 bg-gray-50 dark:bg-background-dark/50">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-10 flex flex-col gap-3">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Flexible Pricing</h2>
                        <p className="text-gray-500 text-sm">Choose the plan that fits your current needs and scale.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 items-center">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
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
                            <div className="col-span-1 text-center text-gray-500">No packages available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="py-16 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3 text-center">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Latest Updates</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-base">Stay in the loop with our newest features.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="h-[350px] bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                                ))
                            ) : news.length > 0 ? (
                                news.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        title={item.title}
                                        bannerUrl={item.banner_url || "https://picsum.photos/800/400"}
                                        content={item.content}
                                        date={new Date(item.created_at ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    />
                                ))
                            ) : (
                                <div className="col-span-1 text-center text-gray-500">No news available</div>
                            )}
                        </div>
                        <button className="text-primary font-bold hover:underline flex items-center justify-center mt-2">
                            View all news <span className="material-symbols-outlined ml-1">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-50 dark:bg-background-dark/50">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Loved by Retailers</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-48 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
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
                            <div className="col-span-1 text-center text-gray-500">No testimonials available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col gap-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">FAQs</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-base">Everything you need to know.</p>
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
            <section id="contact" className="py-16 bg-white dark:bg-background-dark">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col gap-12">
                        <div className="space-y-6 text-center">
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
                                Let&apos;s talk about <br /> <span className="text-primary">growth</span>.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                                Whether you&apos;re a single boutique or a large chain, our POS solution scales with you.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-200 dark:border-white/10">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-primary">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col items-center gap-6 text-center text-white">
                        <h2 className="text-4xl font-black tracking-tight">Ready to transform?</h2>
                        <p className="text-white/80 text-lg">Join over 50,000+ merchants who have streamlined their workflow.</p>
                        <Link
                            href="/login"
                            className="flex w-full max-w-[280px] h-14 items-center justify-center rounded-lg bg-white text-primary font-bold text-lg transition-transform active:scale-95 shadow-xl shadow-black/10 mt-2"
                        >
                            Start Your Free Trial
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
