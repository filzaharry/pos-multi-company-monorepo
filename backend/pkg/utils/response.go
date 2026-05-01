package utils

import (
	"github.com/gofiber/fiber/v2"
)

type Response struct {
	StatusCode int         `json:"status_code"`
	Status     string      `json:"status"`
	Data       interface{} `json:"data"`
}

func SuccessResponse(c *fiber.Ctx, message string, data interface{}) error {
	code := fiber.StatusOK
	return c.Status(code).JSON(Response{
		StatusCode: code,
		Status:     "success",
		Data: fiber.Map{
			"message": message,
			"result":  data,
		},
	})
}

func ErrorResponse(c *fiber.Ctx, status int, message string, data ...interface{}) error {
	var payload interface{}
	if len(data) > 0 {
		payload = data[0]
	}
	return c.Status(status).JSON(Response{
		StatusCode: status,
		Status:     "error",
		Data: fiber.Map{
			"message": message,
			"errors":  payload,
		},
	})
}

