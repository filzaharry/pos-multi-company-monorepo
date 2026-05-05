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

// Helper to get service instance
func testimonialService() service.TestimonialService {
	repo := repository.NewTestimonialRepository(database.DB)
	return service.NewTestimonialService(repo)
}

func GetAllTestimonials(c *fiber.Ctx) error {
	// 1. Inisialisasi default params
	params := utils.FilterParams{Page: 1, Limit: 10}

	// 2. Otomatis isi params dari Query String (page, limit, search, dll)
	if err := c.QueryParser(&params); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid query parameters")
	}

	// 3. Panggil Service
	testimonials, pagination, err := testimonialService().GetAll(params)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Data fetched", fiber.Map{
		"data":       testimonials,
		"pagination": pagination,
	})
}

func CreateTestimonial(c *fiber.Ctx) error {
	req := new(dto.TestimonialRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	status := req.Status
	if status == "" {
		status = "approved"
	}

	testimonial := &models.Testimonial{
		Name:    req.Name,
		Content: req.Content,
		Avatar:  req.Avatar,
		Status:  status,
		Rating:  req.Rating,
	}

	// Handle Image Upload with Validation
	file, err := c.FormFile("avatar")
	if err == nil {
		if err := utils.ValidateFile(file, 1*1024*1024, []string{".jpg", ".jpeg", ".png"}); err != nil {
			return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
		}

		avatarPath, err := utils.SaveUploadedFile(c, "avatar", "testimonials")
		if err == nil {
			testimonial.Avatar = avatarPath
		}
	}

	if err := testimonialService().Create(testimonial); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create testimonial")
	}

	// Logging
	utils.LogActivity("CREATE_TESTIMONIAL", fiber.Map{
		"user_id": c.Locals("user_id"),
		"data":    testimonial,
	})

	return utils.SuccessResponse(c, "Testimonial created", testimonial)
}

func UpdateTestimonial(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.TestimonialRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	updatedData := &models.Testimonial{
		Name:    req.Name,
		Content: req.Content,
		Avatar:  req.Avatar,
		Status:  req.Status,
		Rating:  req.Rating,
	}

	// Handle Image Upload if exists with validation
	file, err := c.FormFile("avatar")
	if err == nil {
		if err := utils.ValidateFile(file, 1*1024*1024, []string{".jpg", ".jpeg", ".png"}); err != nil {
			return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
		}

		avatarPath, err := utils.SaveUploadedFile(c, "avatar", "testimonials")
		if err == nil {
			updatedData.Avatar = avatarPath
		}
	}

	if err := testimonialService().Update(uint(id), updatedData); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Testimonial not found or update failed")
	}

	// Logging
	utils.LogActivity("UPDATE_TESTIMONIAL", fiber.Map{
		"user_id": c.Locals("user_id"),
		"id":      id,
		"data":    updatedData,
	})

	return utils.SuccessResponse(c, "Testimonial updated", updatedData)
}

func GetDetailTestimonial(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	testimonial, err := testimonialService().GetByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Testimonial not found")
	}

	return utils.SuccessResponse(c, "Data fetched", testimonial)
}

func DeleteTestimonial(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	if err := testimonialService().Delete(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Testimonial not found")
	}

	return utils.SuccessResponse(c, "Testimonial deleted", nil)
}
