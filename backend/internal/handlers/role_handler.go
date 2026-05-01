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

func roleService() service.RoleService {
	roleRepo := repository.NewRoleRepository(database.DB)
	userRepo := repository.NewUserRepository(database.DB)
	return service.NewRoleService(roleRepo, userRepo)
}

func GetRoles(c *fiber.Ctx) error {
	params := new(utils.FilterParams)
	if err := c.QueryParser(params); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid query parameters")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	roles, pagination, err := roleService().GetAll(params, companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch roles")
	}

	return utils.SuccessResponse(c, "Roles fetched successfully", fiber.Map{
		"roles":      roles,
		"pagination": pagination,
	})
}

func CreateRole(c *fiber.Ctx) error {
	req := new(dto.RoleRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	role := &models.Role{
		CompanyID:   req.CompanyID,
		Name:        req.Name,
		Description: req.Description,
	}

	if !isSuperAdmin {
		role.CompanyID = companyID
	}

	if err := roleService().Create(role, companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.SuccessResponse(c, "Role created successfully", role)
}

func UpdateRole(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.RoleRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	updatedData := &models.Role{
		Name:        req.Name,
		Description: req.Description,
	}

	if isSuperAdmin && req.CompanyID != nil {
		updatedData.CompanyID = req.CompanyID
	}

	if err := roleService().Update(uint(id), updatedData, companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	// Fetch updated role for response
	role, _ := roleService().GetByID(uint(id), companyID, isSuperAdmin)

	return utils.SuccessResponse(c, "Role updated successfully", role)
}

func DeleteRole(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	if err := roleService().Delete(uint(id), companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.SuccessResponse(c, "Role deleted successfully", nil)
}

// func GetPermissions(c *fiber.Ctx) error {
// 	permissions, err := roleService().GetAllPermissions()
// 	if err != nil {
// 		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch permissions")
// 	}
// 	return utils.SuccessResponse(c, "Permissions fetched successfully", permissions)
// }

func GetRolesWithPermissions(c *fiber.Ctx) error {
	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	roles, err := roleService().GetRolesWithPermissions(companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch roles with permissions")
	}
	return utils.SuccessResponse(c, "Roles with permissions fetched successfully", roles)
}

func UpdateRolePermissions(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	var req dto.UpdateRolePermissionsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(&req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	if err := roleService().UpdatePermissions(uint(id), req.PermissionIDs, companyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Role permissions updated successfully", nil)
}
func GetDetailRole(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	role, err := roleService().GetByID(uint(id), companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Role not found")
	}

	return utils.SuccessResponse(c, "Role fetched successfully", role)
}
