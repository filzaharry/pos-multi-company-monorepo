package handlers

import (
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func dashboardService() service.DashboardService {
	repo := repository.NewDashboardRepository(database.DB)
	return service.NewDashboardService(repo)
}

func GetDashboardOverview(c *fiber.Ctx) error {
	var companyID *uint

	// Try to get company ID from context if user is a company user
	ctxCompanyID := GetContextCompanyID(c)
	if ctxCompanyID != nil {
		companyID = ctxCompanyID
	} else {
		// If super admin, they might pass company_id in query
		companyIDStr := c.Query("company_id")
		if companyIDStr != "" {
			id, err := strconv.ParseUint(companyIDStr, 10, 32)
			if err == nil {
				uintId := uint(id)
				companyID = &uintId
			}
		}
	}

	res, err := dashboardService().GetOverview(companyID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Dashboard overview retrieved successfully", res)
}
