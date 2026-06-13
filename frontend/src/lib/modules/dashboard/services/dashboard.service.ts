import { api } from '@/lib/api/router';

export interface SalesChartData {
    date: string;
    amount: number;
}

export interface DashboardOverviewResponse {
    total_revenue: number;
    total_revenue_change: string;
    total_customers: number;
    total_customers_change: string;
    total_orders: number;
    total_orders_change: string;
    conversion_rate: string;
    conversion_rate_change: string;
    sales_chart: SalesChartData[];
    recent_subscriptions: any[]; // using any[] to avoid strict type coupling to subscription service right now
}

export const getDashboardOverview = async (companyId?: string): Promise<DashboardOverviewResponse> => {
    try {
        const params = companyId ? { company_id: companyId } : undefined;
        const response = await api.get('/dashboard/overview', { params });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
