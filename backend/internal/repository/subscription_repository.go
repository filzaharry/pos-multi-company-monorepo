package repository

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/utils"

	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	GetAll(params *utils.FilterParams) ([]models.Company, int64, error)
	GetHistory(companyID uint) ([]models.CompanySubscription, error)
	GetByID(id uint) (*models.CompanySubscription, error)
	Create(subscription *models.CompanySubscription) error
	Update(subscription *models.CompanySubscription) error
	Delete(id uint) error
	GetStats() (map[string]interface{}, error)
}

type subscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{db}
}

func (r *subscriptionRepository) GetAll(params *utils.FilterParams) ([]models.Company, int64, error) {
	var companies []models.Company
	var total int64

	db := r.db.Model(&models.Company{}).Preload("Subscriptions", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at DESC").Preload("Package")
	})

	if params.Search != "" {
		searchText := "%" + params.Search + "%"
		db = db.Where("name LIKE ? OR email LIKE ?", searchText, searchText)
	}

	if params.Status != "" {
		db = db.Where("status = ?", params.Status)
	}

	db.Count(&total)

	// Sorting
	sortKey := "created_at"
	sortOrder := "desc"
	if params.SortKey != "" {
		sortKey = params.SortKey
	}
	if params.SortOrder != "" {
		sortOrder = params.SortOrder
	}
	db = db.Order(sortKey + " " + sortOrder)

	// Pagination
	offset := (params.Page - 1) * params.Limit
	err := db.Offset(offset).Limit(params.Limit).Find(&companies).Error

	return companies, total, err
}

func (r *subscriptionRepository) GetHistory(companyID uint) ([]models.CompanySubscription, error) {
	var subs []models.CompanySubscription
	err := r.db.Where("company_id = ?", companyID).Preload("Package").Order("created_at desc").Find(&subs).Error
	return subs, err
}

func (r *subscriptionRepository) GetByID(id uint) (*models.CompanySubscription, error) {
	var sub models.CompanySubscription
	err := r.db.Preload("Package").Preload("Company").First(&sub, id).Error
	return &sub, err
}

func (r *subscriptionRepository) Create(subscription *models.CompanySubscription) error {
	return r.db.Create(subscription).Error
}

func (r *subscriptionRepository) Update(subscription *models.CompanySubscription) error {
	return r.db.Save(subscription).Error
}

func (r *subscriptionRepository) Delete(id uint) error {
	return r.db.Delete(&models.CompanySubscription{}, id).Error
}

func (r *subscriptionRepository) GetStats() (map[string]interface{}, error) {
	var total int64
	var active int64
	var pending int64
	var totalRevenue float64

	r.db.Model(&models.CompanySubscription{}).Count(&total)
	r.db.Model(&models.CompanySubscription{}).Where("payment_status = ?", 1).Count(&active)
	r.db.Model(&models.CompanySubscription{}).Where("payment_status = ?", 0).Count(&pending)
	
	// Total Revenue from successful subscriptions
	r.db.Model(&models.CompanySubscription{}).
		Joins("JOIN company_subs_packages ON company_subs_packages.id = company_subscriptions.package_id").
		Where("payment_status = ?", 1).
		Select("SUM(company_subs_packages.pricing)").
		Row().Scan(&totalRevenue)

	return map[string]interface{}{
		"total_subscriptions":  total,
		"active_subscriptions": active,
		"pending_approvals":    pending,
		"total_revenue":       totalRevenue,
	}, nil
}
