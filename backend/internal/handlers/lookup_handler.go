package handlers

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

// GetRoleOptions returns roles as label-value pairs for dropdowns
func GetRoleOptions(c *fiber.Ctx) error {
	roleRepo := repository.NewRoleRepository(database.DB)
	companyID := GetContextCompanyID(c)
	isSuperAdmin := c.Locals("role_name") == "Super Admin"

	roles, err := roleRepo.GetAllList(companyID, isSuperAdmin)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch roles")
	}

	options := make([]dto.LookupOption, len(roles))
	for i, r := range roles {
		options[i] = dto.LookupOption{
			Label: r.Name,
			Value: r.ID,
		}
	}

	return utils.SuccessResponse(c, "Roles fetched successfully", options)
}

// GetCompanyOptions returns companies as label-value pairs for dropdowns
func GetCompanyOptions(c *fiber.Ctx) error {
	var companies []models.Company
	
	// Support search keyword for large datasets
	search := c.Query("search")
	
	query := database.DB.Model(&models.Company{})
	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}
	
	// Standard limit for dropdown search results
	err := query.Limit(50).Find(&companies).Error
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch companies")
	}

	options := make([]dto.LookupOption, len(companies))
	for i, co := range companies {
		options[i] = dto.LookupOption{
			Label: co.Name,
			Value: co.ID,
		}
	}

	return utils.SuccessResponse(c, "Companies fetched successfully", options)
}

// GetPosCategoryOptions returns POS categories as label-value pairs for dropdowns
func GetPosCategoryOptions(c *fiber.Ctx) error {
	companyID := GetContextCompanyID(c)
	if companyID == nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Company ID is required")
	}

	posRepo := repository.NewPosRepository(database.DB)
	// We pass 1 and 1000 for page and limit to get virtually all categories for the dropdown
	categories, _, err := posRepo.GetAllCategories(*companyID, 1, 1000)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch POS categories")
	}

	options := make([]dto.LookupOption, len(categories))
	for i, cat := range categories {
		options[i] = dto.LookupOption{
			Label: cat.Name,
			Value: cat.ID,
		}
	}

	return utils.SuccessResponse(c, "POS Categories fetched successfully", options)
}
