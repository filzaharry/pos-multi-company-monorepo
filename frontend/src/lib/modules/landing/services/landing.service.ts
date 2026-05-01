import { apiHandler, BACKEND_URL } from '@/lib/api/handler';
import { ApiResponse, Testimonial, Package, FAQ, News, TNC } from '../types';

export const landingService = {
    getTestimonials: () => {
        return apiHandler<ApiResponse<Testimonial[]>>((baseUrl) =>
            fetch(`${baseUrl}/landing/testimonials`, { cache: 'no-store' })
        );
    },
    getPackages: () => {
        return apiHandler<ApiResponse<Package[]>>((baseUrl) =>
            fetch(`${baseUrl}/landing/packages`, { cache: 'no-store' })
        );
    },
    getFAQ: () => {
        return apiHandler<ApiResponse<FAQ[]>>((baseUrl) =>
            fetch(`${baseUrl}/landing/faq`, { cache: 'no-store' })
        );
    },
    getNews: () => {
        return apiHandler<ApiResponse<News[]>>((baseUrl) =>
            fetch(`${baseUrl}/landing/news`, { cache: 'no-store' })
        );
    },
    getTNC: () => {
        return apiHandler<ApiResponse<TNC>>((baseUrl) =>
            fetch(`${baseUrl}/landing/tnc`, { cache: 'no-store' })
        );
    }
};
