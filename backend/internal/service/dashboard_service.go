package service

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
)

type DashboardService interface {
	GetOverview(companyID *uint) (*dto.DashboardOverviewResponse, error)
}

type dashboardService struct {
	repo repository.DashboardRepository
}

func NewDashboardService(repo repository.DashboardRepository) DashboardService {
	return &dashboardService{repo}
}

func (s *dashboardService) GetOverview(companyID *uint) (*dto.DashboardOverviewResponse, error) {
	// 1. Total Revenue
	revenue, err := s.repo.GetTotalRevenue(companyID)
	if err != nil {
		return nil, err
	}

	// 2. Total Customers
	customers, err := s.repo.GetTotalCustomers(companyID)
	if err != nil {
		return nil, err
	}

	// 3. Total Orders
	orders, err := s.repo.GetTotalOrders(companyID)
	if err != nil {
		return nil, err
	}

	// 4. Sales Chart (Last 7 days)
	chartData, err := s.repo.GetSalesChart(companyID, 6) // 0 to 6 = 7 days
	if err != nil {
		return nil, err
	}

	// 5. Recent Subscriptions (Limit 5)
	var recentSubs []models.CompanySubscription
	// Only fetch global subscriptions if user is super admin, else maybe nothing.
	// We'll just fetch them globally or let repo handle it.
	// Since subscription is a global table, we can just fetch top 5.
	recentSubs, err = s.repo.GetRecentSubscriptions(5)
	if err != nil {
		return nil, err
	}

	// We calculate dummy conversion rate here or hardcode +change
	// For production, this should be real data if applicable
	return &dto.DashboardOverviewResponse{
		TotalRevenue:         revenue,
		TotalRevenueChange:   "+0.0%", // Placeholder
		TotalCustomers:       customers,
		TotalCustomersChange: "+0.0%",
		TotalOrders:          orders,
		TotalOrdersChange:    "+0.0%",
		ConversionRate:       "0.00%",
		ConversionRateChange: "+0.0%",
		SalesChart:           chartData,
		RecentSubscriptions:  recentSubs,
	}, nil
}
