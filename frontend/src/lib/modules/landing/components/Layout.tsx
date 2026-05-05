'use client';

import React, { useEffect } from 'react';
import { useLanding } from '../store/useLanding';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { LandingLayout as GlobalLandingLayout } from "@/components/layout/LandingLayout";

export const Layout = () => {
    const { header, testimonials, packages, faqs, news, tnc, isLoading, fetchData } = useLanding();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <GlobalLandingLayout>
            <div className="hidden lg:block">
                <Desktop header={header} testimonials={testimonials} packages={packages} faqs={faqs} news={news} tnc={tnc} isLoading={isLoading} />
            </div>
            <div className="block lg:hidden">
                <Mobile header={header} testimonials={testimonials} packages={packages} faqs={faqs} news={news} tnc={tnc} isLoading={isLoading} />
            </div>
        </GlobalLandingLayout>
    );
};
