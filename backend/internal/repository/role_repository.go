package repository

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/utils"

	"gorm.io/gorm"
)

type RoleRepository interface {
	GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.Role, utils.Pagination, error)
	GetAllList(companyID *uint, isSuperAdmin bool) ([]models.Role, error)
	GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.Role, error)
	GetByName(name string) (models.Role, error)
	Create(role *models.Role) error
	Update(role *models.Role) error
	Delete(id uint, companyID *uint, isSuperAdmin bool) error
	
	// Permissions
	GetAllPermissions() ([]models.Permission, error)
	GetRolesWithPermissions(companyID *uint, isSuperAdmin bool) ([]models.Role, error)
	UpdatePermissions(role *models.Role, permissions []models.Permission) error
	GetPermissionsByIDs(ids []uint) ([]models.Permission, error)
}

type roleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) GetAll(params *utils.FilterParams, companyID *uint, isSuperAdmin bool) ([]models.Role, utils.Pagination, error) {
	var roles []models.Role
	query := r.db.Model(&models.Role{}).
		Preload("Permissions").
		Joins("left join companies on companies.id = roles.company_id").
		Select("roles.*, companies.name as company_name")

	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}

	if params.Search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	if params.CompanyID != "" && isSuperAdmin {
		query = query.Where("company_id = ?", params.CompanyID)
	}

	if params.Status != "" {
		isActive := params.Status == "1"
		query = query.Where("is_active = ?", isActive)
	}

	pagination, err := utils.Paginate(query, params.Page, params.Limit, &roles)
	return roles, pagination, err
}

func (r *roleRepository) GetAllList(companyID *uint, isSuperAdmin bool) ([]models.Role, error) {
	var roles []models.Role
	query := r.db.Model(&models.Role{})
	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}
	err := query.Find(&roles).Error
	return roles, err
}

func (r *roleRepository) GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.Role, error) {
	var role models.Role
	query := r.db.Model(&models.Role{})
	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}
	err := query.First(&role, id).Error
	return role, err
}

func (r *roleRepository) GetByName(name string) (models.Role, error) {
	var role models.Role
	err := r.db.Where("name = ?", name).First(&role).Error
	return role, err
}

func (r *roleRepository) Create(role *models.Role) error {
	return r.db.Create(role).Error
}

func (r *roleRepository) Update(role *models.Role) error {
	return r.db.Save(role).Error
}

func (r *roleRepository) Delete(id uint, companyID *uint, isSuperAdmin bool) error {
	query := r.db.Model(&models.Role{})
	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ?", *companyID) // Users can only delete roles in their company
		} else {
			return gorm.ErrRecordNotFound
		}
	}
	return query.Delete(&models.Role{}, id).Error
}

func (r *roleRepository) GetAllPermissions() ([]models.Permission, error) {
	var permissions []models.Permission
	err := r.db.Order("group_name asc, name asc").Find(&permissions).Error
	return permissions, err
}

func (r *roleRepository) GetRolesWithPermissions(companyID *uint, isSuperAdmin bool) ([]models.Role, error) {
	var roles []models.Role
	query := r.db.Preload("Permissions")
	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}
	err := query.Find(&roles).Error
	return roles, err
}

func (r *roleRepository) UpdatePermissions(role *models.Role, permissions []models.Permission) error {
	return r.db.Model(role).Association("Permissions").Replace(permissions)
}

func (r *roleRepository) GetPermissionsByIDs(ids []uint) ([]models.Permission, error) {
	var permissions []models.Permission
	err := r.db.Where("id IN ?", ids).Find(&permissions).Error
	return permissions, err
}
