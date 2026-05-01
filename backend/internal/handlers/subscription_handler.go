package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func subService() service.SubscriptionService {
	repo := repository.NewSubscriptionRepository(database.DB)
	return service.NewSubscriptionService(repo)
}

func GetSubscriptions(c *fiber.Ctx) error {
	params := new(utils.FilterParams)
	if err := c.QueryParser(params); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid query parameters")
	}

	subscriptions, pagination, err := subService().GetAll(params)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch subscriptions")
	}

	return utils.SuccessResponse(c, "Subscriptions fetched successfully", fiber.Map{
		"subscriptions": subscriptions,
		"pagination":    pagination,
	})
}

func GetSubscriptionStats(c *fiber.Ctx) error {
	stats, err := subService().GetStats()
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch stats")
	}
	return utils.SuccessResponse(c, "Stats fetched", stats)
}

func GetDetailSubscription(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)
	
	sub, err := subService().GetByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Subscription not found")
	}
	return utils.SuccessResponse(c, "Subscription fetched successfully", sub)
}

func CreateSubscription(c *fiber.Ctx) error {
	var sub models.CompanySubscription
	if err := c.BodyParser(&sub); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if err := subService().Create(&sub); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create subscription")
	}

	return utils.SuccessResponse(c, "Subscription created", sub)
}

func UpdateSubscription(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	var sub models.CompanySubscription
	if err := c.BodyParser(&sub); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if err := subService().Update(uint(id), &sub); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update subscription")
	}

	return utils.SuccessResponse(c, "Subscription updated", nil)
}

func DeleteSubscription(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	if err := subService().Delete(uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete subscription")
	}
	return utils.SuccessResponse(c, "Subscription deleted", nil)
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


