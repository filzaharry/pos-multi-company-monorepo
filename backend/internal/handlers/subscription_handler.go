package handlers

import (
	"fmt"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"
	"strings"

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
		"result":     subscriptions,
		"pagination": pagination,
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

	contentType := c.Get("Content-Type")
	if strings.Contains(contentType, fiber.MIMEMultipartForm) {
		companyID, _ := strconv.ParseUint(c.FormValue("company_id"), 10, 32)
		if companyID > 0 {
			cid := uint(companyID)
			sub.CompanyID = &cid
		}
		
		sub.FullName = c.FormValue("full_name")
		sub.BusinessEmail = c.FormValue("business_email")
		sub.PhoneNumber = c.FormValue("phone_number")
		sub.CompanyName = c.FormValue("company_name")
		sub.Route = c.FormValue("route")
		
		packageID, _ := strconv.ParseUint(c.FormValue("package_id"), 10, 32)
		sub.PackageID = uint(packageID)
		
		paymentMethod, _ := strconv.ParseInt(c.FormValue("payment_method"), 10, 32)
		sub.PaymentMethod = int(paymentMethod)
		
		paymentStatus, _ := strconv.ParseInt(c.FormValue("payment_status"), 10, 32)
		sub.PaymentStatus = int(paymentStatus)

		receiptPath, err := utils.SaveUploadedFile(c, "payment_receipt", "receipts")
		if err == nil && receiptPath != "" {
			sub.PaymentReceipt = receiptPath
		}
	} else {
		if err := c.BodyParser(&sub); err != nil {
			return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
		}
	}

	if err := subService().Create(&sub); err != nil {
		fmt.Println("Create Subscription Error:", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create subscription: "+err.Error())
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

func GetSubscriptionHistory(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid company ID")
	}

	history, err := subService().GetHistory(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch history")
	}

	return utils.SuccessResponse(c, "History fetched", fiber.Map{
		"result": history,
	})
}

func UpdateCompanyInfo(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid company ID")
	}

	var company models.Company
	if err := database.DB.First(&company, id).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Company not found")
	}

	// Parse text fields from FormValue
	if name := c.FormValue("name"); name != "" {
		company.Name = name
	}
	if email := c.FormValue("email"); email != "" {
		company.Email = email
	}
	if phone := c.FormValue("phone"); phone != "" {
		company.Phone = phone
	}
	if route := c.FormValue("route"); route != "" {
		company.Route = route
	}

	// Handle Image Uploads if they exist
	logoPath, err := utils.SaveUploadedFile(c, "logo", "companies")
	if err == nil && logoPath != "" {
		company.LogoURL = logoPath
	}

	bannerPath, err := utils.SaveUploadedFile(c, "banner", "companies")
	if err == nil && bannerPath != "" {
		company.BannerURL = bannerPath
	}

	if err := database.DB.Save(&company).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update company info")
	}

	return utils.SuccessResponse(c, "Company info updated successfully", company)
}
