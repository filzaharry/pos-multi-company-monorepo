package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func GetLandingHeader(c *fiber.Ctx) error {
	var params []models.GeneralParameter
	database.DB.Where("param_key IN ? AND status = 1", []string{
		"landing_hero_title",
		"landing_hero_subtitle",
		"landing_hero_image",
	}).Find(&params)

	result := fiber.Map{
		"title":    "Powerful POS Subscription for Your Business",
		"subtitle": "Streamline your operations, manage multiple locations, and grow your revenue with our all-in-one POS solution.",
		"image":    "",
	}

	for _, p := range params {
		switch p.ParamKey {
		case "landing_hero_title":
			result["title"] = p.ParamValue
		case "landing_hero_subtitle":
			result["subtitle"] = p.ParamValue
		case "landing_hero_image":
			result["image"] = p.ParamValue
		}
	}

	return utils.SuccessResponse(c, "Landing header fetched", result)
}

func UpdateLandingHeader(c *fiber.Ctx) error {
	var req struct {
		Title    string `json:"title"`
		Subtitle string `json:"subtitle"`
		Image    string `json:"image"`
	}

	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	updateParam := func(key, value string) {
		var param models.GeneralParameter
		err := database.DB.Where("param_key = ?", key).First(&param).Error
		if err != nil {
			// Create if not exists
			database.DB.Create(&models.GeneralParameter{
				ParamKey:   key,
				ParamValue: value,
				Status:     1,
			})
		} else {
			// Update
			param.ParamValue = value
			database.DB.Save(&param)
		}
	}

	if req.Title != "" {
		updateParam("landing_hero_title", req.Title)
	}
	if req.Subtitle != "" {
		updateParam("landing_hero_subtitle", req.Subtitle)
	}
	if req.Image != "" {
		updateParam("landing_hero_image", req.Image)
	}

	return utils.SuccessResponse(c, "Landing header updated successfully", nil)
}
