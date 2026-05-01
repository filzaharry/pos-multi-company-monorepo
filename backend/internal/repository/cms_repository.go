package repository

import (
	"pos-backend/internal/models"

	"gorm.io/gorm"
)

type CMSRepository interface {
	// News
	GetAllNews() ([]models.News, error)
	GetNewsByID(id uint) (models.News, error)
	CreateNews(news *models.News) error
	UpdateNews(news *models.News) error
	DeleteNews(id uint) error

	// FAQ
	GetAllFAQ() ([]models.FAQ, error)
	GetFAQByID(id uint) (models.FAQ, error)
	CreateFAQ(faq *models.FAQ) error
	UpdateFAQ(faq *models.FAQ) error
	DeleteFAQ(id uint) error

	// TNC
	GetTNC() (models.TNC, error)
	UpdateTNC(tnc *models.TNC) error
}

type cmsRepository struct {
	db *gorm.DB
}

func NewCMSRepository(db *gorm.DB) CMSRepository {
	return &cmsRepository{db: db}
}

// News
func (r *cmsRepository) GetAllNews() ([]models.News, error) {
	var news []models.News
	err := r.db.Order("created_at desc").Find(&news).Error
	return news, err
}

func (r *cmsRepository) GetNewsByID(id uint) (models.News, error) {
	var news models.News
	err := r.db.First(&news, id).Error
	return news, err
}

func (r *cmsRepository) CreateNews(news *models.News) error {
	return r.db.Create(news).Error
}

func (r *cmsRepository) UpdateNews(news *models.News) error {
	return r.db.Save(news).Error
}

func (r *cmsRepository) DeleteNews(id uint) error {
	return r.db.Delete(&models.News{}, id).Error
}

// FAQ
func (r *cmsRepository) GetAllFAQ() ([]models.FAQ, error) {
	var faqs []models.FAQ
	err := r.db.Order("created_at desc").Find(&faqs).Error
	return faqs, err
}

func (r *cmsRepository) GetFAQByID(id uint) (models.FAQ, error) {
	var faq models.FAQ
	err := r.db.First(&faq, id).Error
	return faq, err
}

func (r *cmsRepository) CreateFAQ(faq *models.FAQ) error {
	return r.db.Create(faq).Error
}

func (r *cmsRepository) UpdateFAQ(faq *models.FAQ) error {
	return r.db.Save(faq).Error
}

func (r *cmsRepository) DeleteFAQ(id uint) error {
	return r.db.Delete(&models.FAQ{}, id).Error
}

// TNC
func (r *cmsRepository) GetTNC() (models.TNC, error) {
	var tnc models.TNC
	// We only have one TNC record
	err := r.db.FirstOrCreate(&tnc, models.TNC{ID: 1}).Error
	return tnc, err
}

func (r *cmsRepository) UpdateTNC(tnc *models.TNC) error {
	tnc.ID = 1 // Ensure we always update the same record
	return r.db.Save(tnc).Error
}
