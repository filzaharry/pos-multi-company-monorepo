package service

import (
	"errors"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
)

type PermissionService interface {
	GetAll() ([]models.Permission, error)
	GetByID(id uint) (models.Permission, error)
	Create(permission *models.Permission) error
	Update(id uint, updatedData *models.Permission) error
	Delete(id uint) error
}

type permissionService struct {
	repo repository.PermissionRepository
}

func NewPermissionService(repo repository.PermissionRepository) PermissionService {
	return &permissionService{repo: repo}
}

func (s *permissionService) GetAll() ([]models.Permission, error) {
	return s.repo.GetAll()
}

func (s *permissionService) GetByID(id uint) (models.Permission, error) {
	return s.repo.GetByID(id)
}

func (s *permissionService) Create(permission *models.Permission) error {
	if _, err := s.repo.GetBySlug(permission.Slug); err == nil {
		return errors.New("permission slug already exists")
	}
	return s.repo.Create(permission)
}

func (s *permissionService) Update(id uint, updatedData *models.Permission) error {
	permission, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	if updatedData.Slug != "" && updatedData.Slug != permission.Slug {
		if _, err := s.repo.GetBySlug(updatedData.Slug); err == nil {
			return errors.New("permission slug already exists")
		}
		permission.Slug = updatedData.Slug
	}

	permission.Name = updatedData.Name
	permission.GroupName = updatedData.GroupName
	permission.MenuID = updatedData.MenuID

	return s.repo.Update(&permission)
}

func (s *permissionService) Delete(id uint) error {
	return s.repo.Delete(id)
}
