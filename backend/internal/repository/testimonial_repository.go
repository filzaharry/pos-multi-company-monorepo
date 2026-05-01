package repository

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/utils"

	"gorm.io/gorm"
)

type TestimonialRepository interface {
	GetAll(params utils.FilterParams) ([]models.Testimonial, utils.Pagination, error)
	GetByID(id uint) (models.Testimonial, error)
	Create(testimonial *models.Testimonial) error
	Update(current *models.Testimonial, data *models.Testimonial) error
	Delete(id uint) error
}

type testimonialRepository struct {
	db *gorm.DB
}

func NewTestimonialRepository(db *gorm.DB) TestimonialRepository {
	return &testimonialRepository{db: db}
}

func (r *testimonialRepository) GetAll(params utils.FilterParams) ([]models.Testimonial, utils.Pagination, error) {
	var testimonials []models.Testimonial
	query := r.db.Model(&models.Testimonial{})

	if params.Search != "" {
		query = query.Where("name ILIKE ? OR content ILIKE ?", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	if params.Status != "" {
		query = query.Where("status = ?", params.Status)
	}

	if params.StartDate != "" && params.EndDate != "" {
		query = query.Where("created_at BETWEEN ? AND ?", params.StartDate, params.EndDate)
	}

	pagination, err := utils.Paginate(query, params.Page, params.Limit, &testimonials)
	return testimonials, pagination, err
}

func (r *testimonialRepository) GetByID(id uint) (models.Testimonial, error) {
	var testimonial models.Testimonial
	err := r.db.First(&testimonial, id).Error
	return testimonial, err
}

func (r *testimonialRepository) Create(testimonial *models.Testimonial) error {
	return r.db.Create(testimonial).Error
}

func (r *testimonialRepository) Update(current *models.Testimonial, data *models.Testimonial) error {
	// Updates() di GORM otomatis akan mengabaikan field yang bernilai zero/default (0, "", false)
	// Jika ingin mengupdate field zero, gunakan map[string]interface{} atau Select()
	return r.db.Model(current).Updates(data).Error
}

func (r *testimonialRepository) Delete(id uint) error {
	// Karena model Testimonial memiliki field DeletedAt (gorm.DeletedAt),
	// method Delete ini otomatis menjadi Soft Delete.
	return r.db.Delete(&models.Testimonial{}, id).Error
}
