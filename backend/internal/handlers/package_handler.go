package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Packages CRUD
func GetPackages(c *fiber.Ctx) error {
	var packages []models.CompanySubsPackage
	database.DB.Find(&packages)
	return utils.SuccessResponse(c, "Packages fetched", packages)
}

func GetLandingPackages(c *fiber.Ctx) error {
	var packages []models.CompanySubsPackage
	database.DB.Limit(3).Find(&packages)
	return utils.SuccessResponse(c, "Packages fetched", packages)
}

func CreatePackage(c *fiber.Ctx) error {
	var pkg models.CompanySubsPackage
	if err := c.BodyParser(&pkg); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid input")
	}
	
	pkg.CreatedByID = c.Locals("user_id").(uint)
	if err := database.DB.Create(&pkg).Error; err != nil {
		return utils.ErrorResponse(c, 500, err.Error())
	}
	return utils.SuccessResponse(c, "Package created", pkg)
}

func UpdatePackage(c *fiber.Ctx) error {
	id := c.Params("id")
	var pkg models.CompanySubsPackage
	if err := database.DB.First(&pkg, id).Error; err != nil {
		return utils.ErrorResponse(c, 404, "Package not found")
	}
	
	if err := c.BodyParser(&pkg); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid input")
	}
	
	pkg.UpdatedByID = c.Locals("user_id").(uint)
	database.DB.Save(&pkg)
	return utils.SuccessResponse(c, "Package updated", pkg)
}

func DeletePackage(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.CompanySubsPackage{}, id)
	return utils.SuccessResponse(c, "Package deleted", nil)
}

// Renewal
func RenewSubscription(c *fiber.Ctx) error {
	companyID := c.Locals("company_id").(*uint)
	if companyID == nil {
		return utils.ErrorResponse(c, 403, "Only company users can renew subscription")
	}

	packageID, _ := strconv.ParseUint(c.FormValue("package_id"), 10, 32)
	if packageID == 0 {
		return utils.ErrorResponse(c, 400, "Package ID is required")
	}

	file, err := c.FormFile("payment_receipt")
	if err != nil {
		return utils.ErrorResponse(c, 400, "Payment receipt is required")
	}

	// Save file
	filePath := "./public/receipts/" + strconv.FormatInt(time.Now().Unix(), 10) + "_" + file.Filename
	if err := c.SaveFile(file, filePath); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to save receipt")
	}

	// Call Service
	userRepo := repository.NewUserRepository(database.DB)
	authRepo := repository.NewAuthRepository(database.DB)
	roleRepo := repository.NewRoleRepository(database.DB)
	authServ := service.NewAuthService(userRepo, authRepo, roleRepo)

	if err := authServ.RenewSubscription(*companyID, uint(packageID), filePath); err != nil {
		return utils.ErrorResponse(c, 500, err.Error())
	}

	return utils.SuccessResponse(c, "Renewal submitted, waiting for approval", nil)
}
