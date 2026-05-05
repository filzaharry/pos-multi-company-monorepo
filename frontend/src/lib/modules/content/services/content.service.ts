import { apiRouter } from '@/lib/api/router';
import { ApiResponse } from '@/lib/types/api';
import { LandingFaq, LandingPackage, LandingTestimonial } from '../types';

export const contentService = {
    // Packages
    getPackages: async (): Promise<ApiResponse<LandingPackage[]>> => {
        return apiRouter.get<ApiResponse<LandingPackage[]>>('/content/packages');
    },
    createPackage: async (data: Partial<LandingPackage>): Promise<ApiResponse<LandingPackage>> => {
        return apiRouter.post<ApiResponse<LandingPackage>>('/content/packages', data);
    },
    updatePackage: async (id: number, data: Partial<LandingPackage>): Promise<ApiResponse<null>> => {
        return apiRouter.put<ApiResponse<null>>(`/content/packages/${id}`, data);
    },
    deletePackage: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/content/packages/${id}`);
    },

    // Testimonials
    getTestimonials: async (): Promise<ApiResponse<LandingTestimonial[]>> => {
        return apiRouter.get<ApiResponse<LandingTestimonial[]>>('/content/testimonials');
    },
    createTestimonial: async (data: Partial<LandingTestimonial>): Promise<ApiResponse<LandingTestimonial>> => {
        return apiRouter.post<ApiResponse<LandingTestimonial>>('/content/testimonials', data);
    },
    updateTestimonial: async (id: number, data: Partial<LandingTestimonial>): Promise<ApiResponse<null>> => {
        return apiRouter.put<ApiResponse<null>>(`/content/testimonials/${id}`, data);
    },
    deleteTestimonial: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/content/testimonials/${id}`);
    },

    // FAQ
    getFaqs: async (): Promise<ApiResponse<LandingFaq[]>> => {
        return apiRouter.get<ApiResponse<LandingFaq[]>>('/content/faq');
    },
    createFaq: async (data: Partial<LandingFaq>): Promise<ApiResponse<LandingFaq>> => {
        return apiRouter.post<ApiResponse<LandingFaq>>('/content/faq', data);
    },
    updateFaq: async (id: number, data: Partial<LandingFaq>): Promise<ApiResponse<null>> => {
        return apiRouter.put<ApiResponse<null>>(`/content/faq/${id}`, data);
    },
    deleteFaq: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/content/faq/${id}`);
    },

    // Landing Header (Hero)
    getLandingHeader: async (): Promise<ApiResponse<{ title: string; subtitle: string; image: string }>> => {
        return apiRouter.get<ApiResponse<{ title: string; subtitle: string; image: string }>>('/landing/header');
    },
    updateLandingHeader: async (data: { title: string; subtitle: string; image: string }): Promise<ApiResponse<null>> => {
        return apiRouter.put<ApiResponse<null>>('/landing/header', data);
    },
};
