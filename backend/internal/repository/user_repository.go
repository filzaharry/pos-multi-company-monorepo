package repository

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/utils"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.User, utils.Pagination, error)
	GetByID(id uint) (models.User, error)
	GetByEmail(email string) (models.User, error)
	Create(user *models.User) error
	Update(user *models.User) error
	Delete(id uint) error
	CountByRoleID(roleID uint) (int64, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.User, utils.Pagination, error) {
	var users []models.User
	query := r.db.Model(&models.User{}).Preload("Role").Preload("Company")

	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ?", *companyID)
		}
	} else if companyID != nil {
		query = query.Where("company_id = ?", *companyID)
	}

	if params.Search != "" {
		query = query.Where("name ILIKE ? OR email ILIKE ? OR phone ILIKE ?", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	// Additional filter for role_id if passed in query (handled via params or manually)
	// For now, let's just stick to the search

	pagination, err := utils.Paginate(query, params.Page, params.Limit, &users)
	return users, pagination, err
}

func (r *userRepository) GetByID(id uint) (models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Preload("Company").First(&user, id).Error
	return user, err
}

func (r *userRepository) GetByEmail(email string) (models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Preload("Company").Where("email = ?", email).First(&user).Error
	return user, err
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *userRepository) CountByRoleID(roleID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("role_id = ?", roleID).Count(&count).Error
	return count, err
}
