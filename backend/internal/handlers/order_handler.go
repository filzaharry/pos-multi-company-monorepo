package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func CreateOrder(c *fiber.Ctx) error {
	order := new(models.Order)
	if err := c.BodyParser(order); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	// Handle file upload if exists
	file, err := c.FormFile("receipt")
	if err == nil {
		// In real app, save to S3 or local path
		path := "./uploads/" + file.Filename
		// c.SaveFile(file, path) // mock saving
		order.ReceiptPath = path
	}

	if err := database.DB.Create(&order).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to process order")
	}

	return utils.SuccessResponse(c, "Order subscription success", order)
}

func GetOrders(c *fiber.Ctx) error {
	var orders []models.Order
	database.DB.Find(&orders)
	return utils.SuccessResponse(c, "Orders fetched", orders)
}
