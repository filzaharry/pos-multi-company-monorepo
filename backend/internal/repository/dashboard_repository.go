package repository

import (
	"time"

	"pos-backend/internal/dto"
	"pos-backend/internal/models"

	"gorm.io/gorm"
)

type DashboardRepository interface {
	GetTotalRevenue(companyID *uint) (float64, error)
	GetTotalCustomers(companyID *uint) (int64, error)
	GetTotalOrders(companyID *uint) (int64, error)
	GetSalesChart(companyID *uint, days int) ([]dto.SalesChartData, error)
	GetRecentSubscriptions(limit int) ([]models.CompanySubscription, error)
}

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) DashboardRepository {
	return &dashboardRepository{db}
}

func (r *dashboardRepository) GetTotalRevenue(companyID *uint) (float64, error) {
	var total float64
	query := r.db.Model(&models.PosOrder{}).Where("payment_status = ?", "Paid")
	if companyID != nil {
		query = query.Where("company_id = ?", *companyID)
	}
	err := query.Select("COALESCE(SUM(total_amount), 0)").Scan(&total).Error
	return total, err
}

func (r *dashboardRepository) GetTotalCustomers(companyID *uint) (int64, error) {
	var count int64
	query := r.db.Model(&models.PosOrder{})
	if companyID != nil {
		query = query.Where("company_id = ?", *companyID)
	}
	err := query.Distinct("phone_number").Count(&count).Error
	return count, err
}

func (r *dashboardRepository) GetTotalOrders(companyID *uint) (int64, error) {
	var count int64
	query := r.db.Model(&models.PosOrder{})
	if companyID != nil {
		query = query.Where("company_id = ?", *companyID)
	}
	err := query.Count(&count).Error
	return count, err
}

func (r *dashboardRepository) GetSalesChart(companyID *uint, days int) ([]dto.SalesChartData, error) {
	var results []dto.SalesChartData
	
	// Determine the start date
	startDate := time.Now().AddDate(0, 0, -days).Format("2006-01-02")

	query := r.db.Model(&models.PosOrder{}).
		Select("DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as amount").
		Where("payment_status = ?", "Paid").
		Where("DATE(created_at) >= ?", startDate)

	if companyID != nil {
		query = query.Where("company_id = ?", *companyID)
	}

	err := query.Group("DATE(created_at)").Order("DATE(created_at) asc").Scan(&results).Error
	if err != nil {
		return nil, err
	}

	// Fill in missing dates with zero
	dateMap := make(map[string]float64)
	for _, res := range results {
		dateMap[res.Date] = res.Amount
	}

	var finalResults []dto.SalesChartData
	for i := days; i >= 0; i-- {
		dateStr := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		// if format returned from db is different, this might mismatch but typically DATE() returns YYYY-MM-DD
		// amount := dateMap[dateStr] // Removed since amount isn't directly used
		// some dbs return date with time part in map, handle carefully. we assume date format matched.
		// fallback match:
		found := false
		for _, res := range results {
			if len(res.Date) >= 10 && res.Date[:10] == dateStr {
				finalResults = append(finalResults, dto.SalesChartData{Date: dateStr, Amount: res.Amount})
				found = true
				break
			}
		}
		if !found {
			finalResults = append(finalResults, dto.SalesChartData{Date: dateStr, Amount: 0})
		}
	}

	return finalResults, nil
}

func (r *dashboardRepository) GetRecentSubscriptions(limit int) ([]models.CompanySubscription, error) {
	var subscriptions []models.CompanySubscription
	err := r.db.Preload("Package").Preload("Company").
		Order("created_at desc").
		Limit(limit).
		Find(&subscriptions).Error
	return subscriptions, err
}
