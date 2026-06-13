package service

import (
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
)

type SubscriptionService interface {
	GetAll(params *utils.FilterParams) ([]models.Company, utils.Pagination, error)
	GetHistory(companyID uint) ([]models.CompanySubscription, error)
	GetByID(id uint) (*models.CompanySubscription, error)
	Create(subscription *models.CompanySubscription) error
	Update(id uint, data *models.CompanySubscription) error
	Delete(id uint) error
	GetStats() (map[string]interface{}, error)
}

type subscriptionService struct {
	repo repository.SubscriptionRepository
}

func NewSubscriptionService(repo repository.SubscriptionRepository) SubscriptionService {
	return &subscriptionService{repo}
}

func (s *subscriptionService) GetAll(params *utils.FilterParams) ([]models.Company, utils.Pagination, error) {
	if params.Page <= 0 {
		params.Page = 1
	}
	if params.Limit <= 0 {
		params.Limit = 10
	}

	subscriptions, total, err := s.repo.GetAll(params)
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	pagination := utils.ManualPaginate(params.Page, params.Limit, total)
	return subscriptions, pagination, nil
}

func (s *subscriptionService) GetHistory(companyID uint) ([]models.CompanySubscription, error) {
	return s.repo.GetHistory(companyID)
}

func (s *subscriptionService) GetByID(id uint) (*models.CompanySubscription, error) {
	return s.repo.GetByID(id)
}

func (s *subscriptionService) Create(subscription *models.CompanySubscription) error {
	return s.repo.Create(subscription)
}

func (s *subscriptionService) Update(id uint, data *models.CompanySubscription) error {
	sub, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	sub.FullName = data.FullName
	sub.BusinessEmail = data.BusinessEmail
	sub.PhoneNumber = data.PhoneNumber
	sub.CompanyName = data.CompanyName
	sub.Route = data.Route
	sub.PackageID = data.PackageID
	sub.PaymentMethod = data.PaymentMethod
	sub.PaymentStatus = data.PaymentStatus

	if sub.CompanyID != nil && *sub.CompanyID > 0 {
		database.DB.Model(&models.Company{}).Where("id = ?", *sub.CompanyID).Update("route", data.Route)
	}

	return s.repo.Update(sub)
}

func (s *subscriptionService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *subscriptionService) GetStats() (map[string]interface{}, error) {
	return s.repo.GetStats()
}
