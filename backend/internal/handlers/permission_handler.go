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

func permissionService() service.PermissionService {
	repo := repository.NewPermissionRepository(database.DB)
	return service.NewPermissionService(repo)
}

func GetAllPermissions(c *fiber.Ctx) error {
	permissions, err := permissionService().GetAll()
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Permissions fetched successfully", permissions)
}

func GetDetailPermission(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	permission, err := permissionService().GetByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Permission not found")
	}

	return utils.SuccessResponse(c, "Permission fetched successfully", permission)
}

func CreatePermission(c *fiber.Ctx) error {
	req := new(dto.PermissionRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	permission := &models.Permission{
		MenuID:    req.MenuID,
		Name:      req.Name,
		Slug:      req.Slug,
		GroupName: req.GroupName,
	}

	if err := permissionService().Create(permission); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Permission created successfully", permission)
}

func UpdatePermission(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.PermissionRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	permission := &models.Permission{
		MenuID:    req.MenuID,
		Name:      req.Name,
		Slug:      req.Slug,
		GroupName: req.GroupName,
	}

	if err := permissionService().Update(uint(id), permission); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "Permission updated successfully", nil)
}

func DeletePermission(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	if err := permissionService().Delete(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "Permission deleted successfully", nil)
}
