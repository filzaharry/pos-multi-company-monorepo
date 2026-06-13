package dto

import "pos-backend/internal/models"

type SalesChartData struct {
	Date   string  `json:"date"`
	Amount float64 `json:"amount"`
}

type DashboardOverviewResponse struct {
	TotalRevenue        float64                      `json:"total_revenue"`
	TotalRevenueChange  string                       `json:"total_revenue_change"`
	TotalCustomers      int64                        `json:"total_customers"`
	TotalCustomersChange string                      `json:"total_customers_change"`
	TotalOrders         int64                        `json:"total_orders"`
	TotalOrdersChange   string                       `json:"total_orders_change"`
	ConversionRate      string                       `json:"conversion_rate"`
	ConversionRateChange string                      `json:"conversion_rate_change"`
	SalesChart          []SalesChartData             `json:"sales_chart"`
	RecentSubscriptions []models.CompanySubscription `json:"recent_subscriptions"`
}
