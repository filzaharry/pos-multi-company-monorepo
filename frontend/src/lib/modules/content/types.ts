export interface LandingPackage {
    id: number;
    name: string;
    description: string;
    pricing: number;
    status?: string;
}

export interface LandingTestimonial {
    id: number;
    name: string;
    content: string;
    rating: number;
    status?: string;
}

export interface LandingFaq {
    id: number;
    title: string;
    subtitle: string;
    status?: string;
}

export interface ContentSection {
    id: string;
    icon: React.ElementType;
    label: string;
}
