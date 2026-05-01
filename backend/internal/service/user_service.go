package service

import (
	"errors"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.User, utils.Pagination, error)
	GetByID(id uint) (models.User, error)
	GetByEmail(email string) (models.User, error)
	Create(user *models.User) error
	Update(id uint, updatedData *models.User, authCompanyID *uint, isSuperAdmin bool) error
	Delete(id uint, authCompanyID *uint, isSuperAdmin bool) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.User, utils.Pagination, error) {
	return s.repo.GetAll(params, companyID, isSuperAdmin)
}

func (s *userService) GetByID(id uint) (models.User, error) {
	return s.repo.GetByID(id)
}

func (s *userService) GetByEmail(email string) (models.User, error) {
	return s.repo.GetByEmail(email)
}

func (s *userService) Create(user *models.User) error {
	// Hash password if provided
	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	}
	return s.repo.Create(user)
}

func (s *userService) Update(id uint, updatedData *models.User, authCompanyID *uint, isSuperAdmin bool) error {
	user, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	// Auth check
	if !isSuperAdmin {
		if authCompanyID == nil || user.CompanyID == nil || *user.CompanyID != *authCompanyID {
			return errors.New("unauthorized to update this user")
		}
	}

	user.Name = updatedData.Name
	user.Email = updatedData.Email
	user.Phone = updatedData.Phone
	user.RoleID = updatedData.RoleID

	if updatedData.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(updatedData.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	}

	return s.repo.Update(&user)
}

func (s *userService) Delete(id uint, authCompanyID *uint, isSuperAdmin bool) error {
	user, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	// Auth check
	if !isSuperAdmin {
		if authCompanyID == nil || user.CompanyID == nil || *user.CompanyID != *authCompanyID {
			return errors.New("unauthorized to delete this user")
		}
	}

	return s.repo.Delete(id)
}
