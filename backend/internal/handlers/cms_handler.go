package handlers

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func cmsService() service.CMSService {
	repo := repository.NewCMSRepository(database.DB)
	return service.NewCMSService(repo)
}

// News Handlers
func GetAllNews(c *fiber.Ctx) error {
	news, err := cmsService().GetAllNews()
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "News fetched successfully", news)
}

func GetDetailNews(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	news, err := cmsService().GetNewsByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "News not found")
	}

	return utils.SuccessResponse(c, "News fetched successfully", news)
}

func CreateNews(c *fiber.Ctx) error {
	req := new(dto.NewsRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	news := &models.News{
		Title:     req.Title,
		BannerURL: req.BannerURL,
		Content:   req.Content,
	}

	if err := cmsService().CreateNews(news); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "News created successfully", news)
}

func UpdateNews(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.NewsRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	news := &models.News{
		Title:     req.Title,
		BannerURL: req.BannerURL,
		Content:   req.Content,
	}

	if err := cmsService().UpdateNews(uint(id), news); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "News updated successfully", nil)
}

func DeleteNews(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	if err := cmsService().DeleteNews(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "News deleted successfully", nil)
}

// FAQ Handlers
func GetAllFAQ(c *fiber.Ctx) error {
	faqs, err := cmsService().GetAllFAQ()
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "FAQs fetched successfully", faqs)
}

func GetDetailFAQ(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	faq, err := cmsService().GetFAQByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "FAQ not found")
	}

	return utils.SuccessResponse(c, "FAQ fetched successfully", faq)
}

func CreateFAQ(c *fiber.Ctx) error {
	req := new(dto.FAQRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	faq := &models.FAQ{
		Title:    req.Title,
		Subtitle: req.Subtitle,
	}

	if err := cmsService().CreateFAQ(faq); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "FAQ created successfully", faq)
}

func UpdateFAQ(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.FAQRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	faq := &models.FAQ{
		Title:    req.Title,
		Subtitle: req.Subtitle,
	}

	if err := cmsService().UpdateFAQ(uint(id), faq); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "FAQ updated successfully", nil)
}

func DeleteFAQ(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	if err := cmsService().DeleteFAQ(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "FAQ deleted successfully", nil)
}

// TNC Handlers
func GetTNC(c *fiber.Ctx) error {
	tnc, err := cmsService().GetTNC()
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "TNC fetched successfully", tnc)
}

func UpdateTNC(c *fiber.Ctx) error {
	req := new(dto.TNCRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	if err := cmsService().UpdateTNC(req.Content); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "TNC updated successfully", nil)
}
