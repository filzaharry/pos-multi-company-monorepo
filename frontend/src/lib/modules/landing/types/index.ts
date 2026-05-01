export interface ApiResponse<T> {
    status_code: number;
    status: string;
    data: {
        message: string;
        result: T;
    };
}

export interface ListResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        last_page: number;
    };
}

export interface Testimonial {
    id: number;
    name: string;
    content: string;
    avatar: string;
    status: string;
    rating: number;
    role?: string; // used in current page.tsx logic
    created_at?: string;
}

export interface Package {
    id: number;
    name: string;
    description: string;
    pricing: number;
    created_at?: string;
    updated_at?: string;
}

export interface FAQ {
    id: number;
    title: string;
    subtitle: string;
    created_at?: string;
}

export interface News {
    id: number;
    title: string;
    banner_url: string;
    content: string;
    created_at?: string;
}

export interface TNC {
    id: number;
    content: string;
}

export interface LandingState {
    testimonials: Testimonial[];
    packages: Package[];
    faqs: FAQ[];
    news: News[];
    tnc: TNC | null;
    isLoading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
}
