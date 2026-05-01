package service

import (
	"errors"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
)

type GeneralParameterService interface {
	GetAll(companyID *uint, isSuperAdmin bool) ([]models.GeneralParameter, error)
	GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.GeneralParameter, error)
	Create(param *models.GeneralParameter, companyID *uint, isSuperAdmin bool) error
	Update(id uint, updatedData *models.GeneralParameter, companyID *uint, isSuperAdmin bool) error
	Delete(id uint, companyID *uint, isSuperAdmin bool) error
}

type generalParameterService struct {
	repo repository.GeneralParameterRepository
}

func NewGeneralParameterService(repo repository.GeneralParameterRepository) GeneralParameterService {
	return &generalParameterService{repo: repo}
}

func (s *generalParameterService) GetAll(companyID *uint, isSuperAdmin bool) ([]models.GeneralParameter, error) {
	return s.repo.GetAll(companyID, isSuperAdmin)
}

func (s *generalParameterService) GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.GeneralParameter, error) {
	return s.repo.GetByID(id, companyID, isSuperAdmin)
}

func (s *generalParameterService) Create(param *models.GeneralParameter, companyID *uint, isSuperAdmin bool) error {
	if !isSuperAdmin {
		param.CompanyID = companyID
	}
	
	// Check if key already exists for this company (or global)
	if _, err := s.repo.GetByKey(param.ParamKey, param.CompanyID); err == nil {
		return errors.New("parameter key already exists")
	}

	return s.repo.Create(param)
}

func (s *generalParameterService) Update(id uint, updatedData *models.GeneralParameter, companyID *uint, isSuperAdmin bool) error {
	param, err := s.repo.GetByID(id, companyID, isSuperAdmin)
	if err != nil {
		return err
	}

	if updatedData.ParamValue != "" {
		param.ParamValue = updatedData.ParamValue
	}
	if updatedData.Description != "" {
		param.Description = updatedData.Description
	}
	param.Status = updatedData.Status
	
	if isSuperAdmin && updatedData.CompanyID != nil {
		param.CompanyID = updatedData.CompanyID
	}

	return s.repo.Update(&param)
}

func (s *generalParameterService) Delete(id uint, companyID *uint, isSuperAdmin bool) error {
	return s.repo.Delete(id, companyID, isSuperAdmin)
}
