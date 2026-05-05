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

func userService() service.UserService {
	userRepo := repository.NewUserRepository(database.DB)
	return service.NewUserService(userRepo)
}

func GetUsers(c *fiber.Ctx) error {
	currentUserID := c.Locals("user_id").(uint)

	// Fetch current user to check role
	userRepo := repository.NewUserRepository(database.DB)
	currentUser, err := userRepo.GetByID(currentUserID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not found")
	}

	params := new(utils.FilterParams)
	if err := c.QueryParser(params); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid query parameters")
	}

	companyID := GetContextCompanyID(c)
	isSuperAdmin := currentUser.Role.Name == "Super Admin"

	users, pagination, err := userService().GetAll(params, companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch users")
	}

	return utils.SuccessResponse(c, "Users fetched successfully", fiber.Map{
		"users":      users,
		"pagination": pagination,
	})
}

func CreateUser(c *fiber.Ctx) error {
	req := new(dto.CreateUserRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	userInput := &models.User{
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		Password:  req.Password,
		RoleID:    &req.RoleID,
		CompanyID: req.CompanyID,
	}

	// Auth context
	currentUserID := c.Locals("user_id").(uint)
	currentCompanyID := c.Locals("company_id")

	userRepo := repository.NewUserRepository(database.DB)
	currentUser, _ := userRepo.GetByID(currentUserID)

	// Ensure Admin cannot create users for other companies
	if currentUser.Role.Name != "Super Admin" {
		if currentCompanyID == nil {
			return utils.ErrorResponse(c, fiber.StatusForbidden, "Unauthorized")
		}
		if cid, ok := currentCompanyID.(*uint); ok {
			userInput.CompanyID = cid
		}
	}

	if err := userService().Create(userInput); err != nil {
		return utils.ErrorResponse(c, fiber.StatusConflict, err.Error())
	}

	// Reload to get associations
	user, _ := userService().GetByID(userInput.ID)

	return utils.SuccessResponse(c, "User created successfully", user)
}

func UpdateUser(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	req := new(dto.UpdateUserRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	updatedData := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: req.Password,
		RoleID:   &req.RoleID,
	}

	// Auth check
	currentUserID := c.Locals("user_id").(uint)
	currentCompanyID := c.Locals("company_id")

	userRepo := repository.NewUserRepository(database.DB)
	currentUser, _ := userRepo.GetByID(currentUserID)

	var authCompanyID *uint
	if cid, ok := currentCompanyID.(*uint); ok {
		authCompanyID = cid
	}

	isSuperAdmin := currentUser.Role.Name == "Super Admin"

	if err := userService().Update(uint(id), updatedData, authCompanyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	user, _ := userService().GetByID(uint(id))

	return utils.SuccessResponse(c, "User updated successfully", user)
}

func DeleteUser(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format: '"+idStr+"'")
	}

	// Auth check
	currentUserID := c.Locals("user_id").(uint)
	currentCompanyID := c.Locals("company_id")

	userRepo := repository.NewUserRepository(database.DB)
	currentUser, _ := userRepo.GetByID(currentUserID)

	var authCompanyID *uint
	if cid, ok := currentCompanyID.(*uint); ok {
		authCompanyID = cid
	}

	isSuperAdmin := currentUser.Role.Name == "Super Admin"

	if err := userService().Delete(uint(id), authCompanyID, isSuperAdmin); err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	return utils.SuccessResponse(c, "User deleted successfully", nil)
}
func GetDetailUser(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid ID format")
	}

	user, err := userService().GetByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "User not found")
	}

	return utils.SuccessResponse(c, "User fetched successfully", user)
}
