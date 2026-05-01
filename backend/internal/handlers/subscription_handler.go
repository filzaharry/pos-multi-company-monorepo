package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)


func CreateSubscription(c *fiber.Ctx) error {
	var company models.Company
	if err := c.BodyParser(&company); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid input")
	}

	if err := database.DB.Create(&company).Error; err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create subscription")
	}

	return utils.SuccessResponse(c, "Subscription created", company)
}

func UpdateSubscription(c *fiber.Ctx) error {
	id := c.Params("id")
	var company models.Company
	if err := database.DB.First(&company, id).Error; err != nil {
		return utils.ErrorResponse(c, 404, "Subscription not found")
	}

	if err := c.BodyParser(&company); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid input")
	}

	database.DB.Save(&company)
	return utils.SuccessResponse(c, "Subscription updated", company)
}

func DeleteSubscription(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Company{}, id).Error; err != nil {
		return utils.ErrorResponse(c, 500, "Failed to delete subscription")
	}
	return utils.SuccessResponse(c, "Subscription deleted", nil)
}

func GetSubscriptionStats(c *fiber.Ctx) error {
	var total int64
	var active int64
	var inactive int64
	var pending int64

	database.DB.Model(&models.Company{}).Count(&total)
	database.DB.Model(&models.Company{}).Where("subscription_status = ?", "active").Count(&active)
	database.DB.Model(&models.Company{}).Where("subscription_status = ?", "inactive").Count(&inactive)
	database.DB.Model(&models.Company{}).Where("subscription_status = ?", "pending").Count(&pending)

	return utils.SuccessResponse(c, "Stats fetched", fiber.Map{
		"total":    total,
		"active":   active,
		"inactive": inactive,
		"pending":  pending,
	})
}
func GetSubscriptions(c *fiber.Ctx) error {
	var companies []models.Company
	if err := database.DB.Find(&companies).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch subscriptions")
	}
	return utils.SuccessResponse(c, "Subscriptions fetched successfully", companies)
}

func GetDetailSubscription(c *fiber.Ctx) error {
	id := c.Params("id")
	var company models.Company
	if err := database.DB.First(&company, id).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Subscription not found")
	}
	return utils.SuccessResponse(c, "Subscription fetched successfully", company)
}

func ApproveSubscription(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid subscription ID")
	}

	if err := authService().ApproveSubscription(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Subscription approved, company and user created", nil)
}
