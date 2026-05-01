package service

import (
	"errors"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"
)

type RoleService interface {
	GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.Role, utils.Pagination, error)
	GetAllList(companyID *uint, isSuperAdmin bool) ([]models.Role, error)
	GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.Role, error)
	Create(role *models.Role, companyID *uint, isSuperAdmin bool) error
	Update(id uint, updatedData *models.Role, companyID *uint, isSuperAdmin bool) error
	Delete(id uint, companyID *uint, isSuperAdmin bool) error

	// Permissions
	GetAllPermissions() ([]models.Permission, error)
	GetRolesWithPermissions(companyID *uint, isSuperAdmin bool) ([]models.Role, error)
	UpdatePermissions(roleID uint, permissionIDs []uint, companyID *uint, isSuperAdmin bool) error
}

type roleService struct {
	repo       repository.RoleRepository
	userRepo   repository.UserRepository // We'll need this to check if role is used
}

func NewRoleService(repo repository.RoleRepository, userRepo repository.UserRepository) RoleService {
	return &roleService{
		repo:     repo,
		userRepo: userRepo,
	}
}

func (s *roleService) GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.Role, utils.Pagination, error) {
	return s.repo.GetAll(params, companyID, isSuperAdmin)
}

func (s *roleService) GetAllList(companyID *uint, isSuperAdmin bool) ([]models.Role, error) {
	return s.repo.GetAllList(companyID, isSuperAdmin)
}

func (s *roleService) GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.Role, error) {
	return s.repo.GetByID(id, companyID, isSuperAdmin)
}

func (s *roleService) Create(role *models.Role, companyID *uint, isSuperAdmin bool) error {
	if !isSuperAdmin {
		role.CompanyID = companyID
	}
	// Check if exists
	existing, err := s.repo.GetByName(role.Name)
	if err == nil {
		// Only consider duplicate if it belongs to the same company or if it's a global role conflicting
		if existing.CompanyID == role.CompanyID {
			return errors.New("role name already exists")
		}
	}
	return s.repo.Create(role)
}

func (s *roleService) Update(id uint, updatedData *models.Role, companyID *uint, isSuperAdmin bool) error {
	role, err := s.repo.GetByID(id, companyID, isSuperAdmin)
	if err != nil {
		return err
	}

	if updatedData.Name != "" && updatedData.Name != role.Name {
		existing, err := s.repo.GetByName(updatedData.Name)
		if err == nil {
			if existing.CompanyID == role.CompanyID {
				return errors.New("role name already exists")
			}
		}
		role.Name = updatedData.Name
	}

	if updatedData.Description != "" {
		role.Description = updatedData.Description
	}

	return s.repo.Update(&role)
}

func (s *roleService) Delete(id uint, companyID *uint, isSuperAdmin bool) error {
	role, err := s.repo.GetByID(id, companyID, isSuperAdmin)
	if err != nil {
		return err
	}

	// Prevent deleting system roles
	if role.Name == "Super Admin" || role.Name == "Admin" {
		return errors.New("system roles cannot be deleted")
	}

	// Check if users are using this role
	count, err := s.userRepo.CountByRoleID(id)
	if err != nil {
		return err
	}
	if count > 0 {
		return errors.New("cannot delete role because it is assigned to users")
	}

	return s.repo.Delete(id, companyID, isSuperAdmin)
}

func (s *roleService) GetAllPermissions() ([]models.Permission, error) {
	return s.repo.GetAllPermissions()
}

func (s *roleService) GetRolesWithPermissions(companyID *uint, isSuperAdmin bool) ([]models.Role, error) {
	return s.repo.GetRolesWithPermissions(companyID, isSuperAdmin)
}

func (s *roleService) UpdatePermissions(roleID uint, permissionIDs []uint, companyID *uint, isSuperAdmin bool) error {
	role, err := s.repo.GetByID(roleID, companyID, isSuperAdmin)
	if err != nil {
		return err
	}

	var permissions []models.Permission
	if len(permissionIDs) > 0 {
		permissions, err = s.repo.GetPermissionsByIDs(permissionIDs)
		if err != nil {
			return err
		}
	}

	return s.repo.UpdatePermissions(&role, permissions)
}
