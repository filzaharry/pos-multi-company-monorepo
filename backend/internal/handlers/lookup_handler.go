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
