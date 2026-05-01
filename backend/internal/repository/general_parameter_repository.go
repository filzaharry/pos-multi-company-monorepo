package repository

import (
	"pos-backend/internal/models"
	"gorm.io/gorm"
)

type GeneralParameterRepository interface {
	GetAll(companyID *uint, isSuperAdmin bool) ([]models.GeneralParameter, error)
	GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.GeneralParameter, error)
	GetByKey(key string, companyID *uint) (models.GeneralParameter, error)
	Create(param *models.GeneralParameter) error
	Update(param *models.GeneralParameter) error
	Delete(id uint, companyID *uint, isSuperAdmin bool) error
}

type generalParameterRepository struct {
	db *gorm.DB
}

func NewGeneralParameterRepository(db *gorm.DB) GeneralParameterRepository {
	return &generalParameterRepository{db: db}
}

func (r *generalParameterRepository) GetAll(companyID *uint, isSuperAdmin bool) ([]models.GeneralParameter, error) {
	var params []models.GeneralParameter
	query := r.db.Model(&models.GeneralParameter{})

	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}

	err := query.Find(&params).Error
	return params, err
}

func (r *generalParameterRepository) GetByID(id uint, companyID *uint, isSuperAdmin bool) (models.GeneralParameter, error) {
	var param models.GeneralParameter
	query := r.db.Model(&models.GeneralParameter{})

	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
		} else {
			query = query.Where("company_id IS NULL")
		}
	}

	err := query.First(&param, id).Error
	return param, err
}

func (r *generalParameterRepository) GetByKey(key string, companyID *uint) (models.GeneralParameter, error) {
	var param models.GeneralParameter
	query := r.db.Where("param_key = ?", key)
	if companyID != nil {
		query = query.Where("company_id = ? OR company_id IS NULL", *companyID)
	} else {
		query = query.Where("company_id IS NULL")
	}
	err := query.First(&param).Error
	return param, err
}

func (r *generalParameterRepository) Create(param *models.GeneralParameter) error {
	return r.db.Create(param).Error
}

func (r *generalParameterRepository) Update(param *models.GeneralParameter) error {
	return r.db.Save(param).Error
}

func (r *generalParameterRepository) Delete(id uint, companyID *uint, isSuperAdmin bool) error {
	query := r.db.Model(&models.GeneralParameter{})
	if !isSuperAdmin {
		if companyID != nil {
			query = query.Where("company_id = ?", *companyID)
		} else {
			return gorm.ErrRecordNotFound
		}
	}
	return query.Delete(&models.GeneralParameter{}, id).Error
}
