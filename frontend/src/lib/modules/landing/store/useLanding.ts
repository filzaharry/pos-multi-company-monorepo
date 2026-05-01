import { create } from 'zustand';
import { apiRouter } from '@/lib/api/router';
import { LandingState, ApiResponse, Testimonial, Package, FAQ, News, TNC, ListResult } from '../types';

export const useLanding = create<LandingState>((set) => ({
    testimonials: [],
    packages: [],
    faqs: [],
    news: [],
    tnc: null,
    isLoading: false,
    error: null,
    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [testimonialsRes, packagesRes, faqRes, newsRes, tncRes] = await Promise.all([
                apiRouter.get<ApiResponse<ListResult<Testimonial>>>('/landing/testimonials'),
                apiRouter.get<ApiResponse<Package[]>>('/landing/packages'),
                apiRouter.get<ApiResponse<FAQ[]>>('/landing/faq'),
                apiRouter.get<ApiResponse<News[]>>('/landing/news'),
                apiRouter.get<ApiResponse<TNC>>('/landing/tnc')
            ]);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isSuccess = (res: ApiResponse<any>) => res.status === 'success' || res.status === 'Success';

            set({
                testimonials: isSuccess(testimonialsRes) ? testimonialsRes.data.result.data : [],
                packages: isSuccess(packagesRes) ? packagesRes.data.result : [],
                faqs: isSuccess(faqRes) ? faqRes.data.result : [],
                news: isSuccess(newsRes) ? newsRes.data.result : [],
                tnc: isSuccess(tncRes) ? tncRes.data.result : null,
                isLoading: false
            });
        } catch (error: unknown) {
            console.error('Failed to fetch landing data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
            set({ error: errorMessage, isLoading: false });
        }
    }
}));
