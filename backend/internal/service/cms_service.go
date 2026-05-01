package service

import (
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
)

type CMSService interface {
	// News
	GetAllNews() ([]models.News, error)
	GetNewsByID(id uint) (models.News, error)
	CreateNews(news *models.News) error
	UpdateNews(id uint, updatedData *models.News) error
	DeleteNews(id uint) error

	// FAQ
	GetAllFAQ() ([]models.FAQ, error)
	GetFAQByID(id uint) (models.FAQ, error)
	CreateFAQ(faq *models.FAQ) error
	UpdateFAQ(id uint, updatedData *models.FAQ) error
	DeleteFAQ(id uint) error

	// TNC
	GetTNC() (models.TNC, error)
	UpdateTNC(content string) error
}

type cmsService struct {
	repo repository.CMSRepository
}

func NewCMSService(repo repository.CMSRepository) CMSService {
	return &cmsService{repo: repo}
}

// News
func (s *cmsService) GetAllNews() ([]models.News, error) {
	return s.repo.GetAllNews()
}

func (s *cmsService) GetNewsByID(id uint) (models.News, error) {
	return s.repo.GetNewsByID(id)
}

func (s *cmsService) CreateNews(news *models.News) error {
	return s.repo.CreateNews(news)
}

func (s *cmsService) UpdateNews(id uint, updatedData *models.News) error {
	news, err := s.repo.GetNewsByID(id)
	if err != nil {
		return err
	}

	news.Title = updatedData.Title
	news.BannerURL = updatedData.BannerURL
	news.Content = updatedData.Content

	return s.repo.UpdateNews(&news)
}

func (s *cmsService) DeleteNews(id uint) error {
	return s.repo.DeleteNews(id)
}

// FAQ
func (s *cmsService) GetAllFAQ() ([]models.FAQ, error) {
	return s.repo.GetAllFAQ()
}

func (s *cmsService) GetFAQByID(id uint) (models.FAQ, error) {
	return s.repo.GetFAQByID(id)
}

func (s *cmsService) CreateFAQ(faq *models.FAQ) error {
	return s.repo.CreateFAQ(faq)
}

func (s *cmsService) UpdateFAQ(id uint, updatedData *models.FAQ) error {
	faq, err := s.repo.GetFAQByID(id)
	if err != nil {
		return err
	}

	faq.Title = updatedData.Title
	faq.Subtitle = updatedData.Subtitle

	return s.repo.UpdateFAQ(&faq)
}

func (s *cmsService) DeleteFAQ(id uint) error {
	return s.repo.DeleteFAQ(id)
}

// TNC
func (s *cmsService) GetTNC() (models.TNC, error) {
	return s.repo.GetTNC()
}

func (s *cmsService) UpdateTNC(content string) error {
	tnc := &models.TNC{
		Content: content,
	}
	return s.repo.UpdateTNC(tnc)
}
