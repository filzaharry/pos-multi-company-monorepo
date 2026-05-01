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

func generalParameterService() service.GeneralParameterService {
	repo := repository.NewGeneralParameterRepository(database.DB)
	return service.NewGeneralParameterService(repo)
}

func GetGeneralParameters(c *fiber.Ctx) error {
	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	params, err := generalParameterService().GetAll(companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch general parameters")
	}

	return utils.SuccessResponse(c, "General parameters fetched successfully", params)
}

func CreateGeneralParameter(c *fiber.Ctx) error {
	req := new(dto.GeneralParameterRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	param := &models.GeneralParameter{
		CompanyID:   req.CompanyID,
		ParamKey:    req.ParamKey,
		ParamValue:  req.ParamValue,
		Description: req.Description,
		Status:      req.Status,
	}

	if !isSuperAdmin {
		param.CompanyID = companyID
	}

	if err := generalParameterService().Create(param, companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.SuccessResponse(c, "General parameter created successfully", param)
}

func UpdateGeneralParameter(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.GeneralParameterRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	updatedData := &models.GeneralParameter{
		CompanyID:   req.CompanyID,
		ParamValue:  req.ParamValue,
		Description: req.Description,
		Status:      req.Status,
	}

	if err := generalParameterService().Update(uint(id), updatedData, companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "General parameter updated successfully", nil)
}

func DeleteGeneralParameter(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	if err := generalParameterService().Delete(uint(id), companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "General parameter deleted successfully", nil)
}
