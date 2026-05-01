package service

import (
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"
)

type TestimonialService interface {
	GetAll(params utils.FilterParams) ([]models.Testimonial, utils.Pagination, error)
	GetByID(id uint) (models.Testimonial, error)
	Create(testimonial *models.Testimonial) error
	Update(id uint, testimonial *models.Testimonial) error
	Delete(id uint) error
}

type testimonialService struct {
	repo repository.TestimonialRepository
}

func NewTestimonialService(repo repository.TestimonialRepository) TestimonialService {
	return &testimonialService{repo: repo}
}

func (s *testimonialService) GetAll(params utils.FilterParams) ([]models.Testimonial, utils.Pagination, error) {
	return s.repo.GetAll(params)
}

func (s *testimonialService) GetByID(id uint) (models.Testimonial, error) {
	return s.repo.GetByID(id)
}

func (s *testimonialService) Create(testimonial *models.Testimonial) error {
	return s.repo.Create(testimonial)
}

func (s *testimonialService) Update(id uint, updatedData *models.Testimonial) error {
	// 1. Cek keberadaan data
	testimonial, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	// 2. Oper ke repository untuk partial update menggunakan GORM Updates
	return s.repo.Update(&testimonial, updatedData)
}

func (s *testimonialService) Delete(id uint) error {
	// Pastikan data ada sebelum dihapus (opsional, tapi bagus untuk feedback error)
	if _, err := s.repo.GetByID(id); err != nil {
		return err
	}
	return s.repo.Delete(id)
}
