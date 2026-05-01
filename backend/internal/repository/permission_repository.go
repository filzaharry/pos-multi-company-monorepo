package repository

import (
	"pos-backend/internal/models"
	"gorm.io/gorm"
)

type PermissionRepository interface {
	GetAll() ([]models.Permission, error)
	GetByID(id uint) (models.Permission, error)
	GetBySlug(slug string) (models.Permission, error)
	Create(permission *models.Permission) error
	Update(permission *models.Permission) error
	Delete(id uint) error
}

type permissionRepository struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) PermissionRepository {
	return &permissionRepository{db: db}
}

func (r *permissionRepository) GetAll() ([]models.Permission, error) {
	var permissions []models.Permission
	err := r.db.Order("group_name asc, name asc").Find(&permissions).Error
	return permissions, err
}

func (r *permissionRepository) GetByID(id uint) (models.Permission, error) {
	var permission models.Permission
	err := r.db.First(&permission, id).Error
	return permission, err
}

func (r *permissionRepository) GetBySlug(slug string) (models.Permission, error) {
	var permission models.Permission
	err := r.db.Where("slug = ?", slug).First(&permission).Error
	return permission, err
}

func (r *permissionRepository) Create(permission *models.Permission) error {
	return r.db.Create(permission).Error
}

func (r *permissionRepository) Update(permission *models.Permission) error {
	return r.db.Save(permission).Error
}

func (r *permissionRepository) Delete(id uint) error {
	return r.db.Delete(&models.Permission{}, id).Error
}
