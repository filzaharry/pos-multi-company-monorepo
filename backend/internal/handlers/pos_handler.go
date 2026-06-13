package handlers

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func posService() service.PosService {
	repo := repository.NewPosRepository(database.DB)
	return service.NewPosService(repo)
}

func getCompanyID(c *fiber.Ctx) (uint, error) {
	companyID := GetContextCompanyID(c)
	if companyID == nil {
		return 0, fiber.NewError(fiber.StatusForbidden, "No company context found. POS operations are restricted to company users.")
	}
	return *companyID, nil
}

// Categories
func GetPosCategories(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	categories, pagination, err := posService().GetCategories(companyID, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Categories fetched successfully", fiber.Map{
		"items":      categories,
		"pagination": pagination,
	})
}

func GetPosCategoryDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	category, err := posService().GetCategory(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Category not found")
	}
	return utils.SuccessResponse(c, "Category fetched successfully", category)
}

func CreatePosCategory(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	req := new(dto.PosCategoryRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	category, err := posService().CreateCategory(companyID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Category created successfully", category)
}

func UpdatePosCategory(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosCategoryRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	category, err := posService().UpdateCategory(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Category updated successfully", category)
}

func DeletePosCategory(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteCategory(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Category deleted successfully", nil)
}

// Products
func GetPosProducts(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	categoryID, _ := strconv.ParseUint(c.Query("category_id"), 10, 32)
	search := c.Query("search")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	products, pagination, err := posService().GetProducts(companyID, uint(categoryID), search, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Products fetched successfully", fiber.Map{
		"items":      products,
		"pagination": pagination,
	})
}

func GetPosProductDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	product, err := posService().GetProduct(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Product not found")
	}
	return utils.SuccessResponse(c, "Product fetched successfully", product)
}

func CreatePosProduct(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	req := new(dto.PosProductRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input: "+err.Error())
	}

	// Handle Image Upload if exists
	imagePath, err := utils.SaveUploadedFile(c, "image", "products")
	if err == nil && imagePath != "" {
		req.ImageURL = imagePath
	}

	product, err := posService().CreateProduct(companyID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Product created successfully", product)
}

func UpdatePosProduct(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosProductRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input: "+err.Error())
	}

	// Handle Image Upload if exists
	imagePath, err := utils.SaveUploadedFile(c, "image", "products")
	if err == nil && imagePath != "" {
		req.ImageURL = imagePath
	}

	product, err := posService().UpdateProduct(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Product updated successfully", product)
}

func DeletePosProduct(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteProduct(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Product deleted successfully", nil)
}

// Orders
func GetPosOrders(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	orders, pagination, err := posService().GetOrders(companyID, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Orders fetched successfully", fiber.Map{
		"items":      orders,
		"pagination": pagination,
	})
}

func GetPosOrderDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	order, err := posService().GetOrder(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Order not found")
	}
	return utils.SuccessResponse(c, "Order fetched successfully", order)
}

func CreatePosOrder(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	userID := c.Locals("user_id").(uint)
	req := new(dto.PosOrderRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	order, err := posService().CreateOrder(companyID, userID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Order created successfully", order)
}

func UpdatePosOrder(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosUpdateOrderStatusRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	order, err := posService().UpdateOrder(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Order updated successfully", order)
}

func DeletePosOrder(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteOrder(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Order deleted successfully", nil)
}

// Deliveries
func GetPosDeliveries(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	deliveries, pagination, err := posService().GetDeliveries(companyID, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Deliveries fetched successfully", fiber.Map{
		"items":      deliveries,
		"pagination": pagination,
	})
}

func GetPosDeliveryDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	delivery, err := posService().GetDelivery(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Delivery not found")
	}
	return utils.SuccessResponse(c, "Delivery fetched successfully", delivery)
}

func CreatePosDelivery(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	req := new(dto.PosDeliveryRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	delivery, err := posService().CreateDelivery(companyID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Delivery created successfully", delivery)
}

func UpdatePosDelivery(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosDeliveryRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	delivery, err := posService().UpdateDelivery(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Delivery updated successfully", delivery)
}

func DeletePosDelivery(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteDelivery(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Delivery deleted successfully", nil)
}

func GetPosDashboardStats(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	stats, err := posService().GetStats(companyID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Dashboard stats fetched successfully", stats)
}

// App Routes (Public)
func ResolveAppPosCompany(c *fiber.Ctx) error {
	route := c.Params("route")
	
	var company models.Company
	if err := database.DB.Where("route = ?", route).First(&company).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Store not found")
	}

	if company.Status != 1 {
		return utils.ErrorResponse(c, fiber.StatusForbidden, "Store is currently inactive")
	}

	if company.SubscriptionEndDate != nil && company.SubscriptionEndDate.Before(time.Now()) {
		return utils.ErrorResponse(c, fiber.StatusForbidden, "Store subscription has expired")
	}

	return utils.SuccessResponse(c, "Store resolved successfully", fiber.Map{
		"id":       company.ID,
		"name":     company.Name,
		"logo_url": company.LogoURL,
		"address":  company.Address,
		"phone":    company.Phone,
	})
}

func GetAppPosCategories(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	categories, _, err := posService().GetCategories(uint(companyID), 1, 100) // Get all for app
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Categories fetched successfully", categories)
}

func GetAppPosProducts(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	categoryID, _ := strconv.ParseUint(c.Query("category_id"), 10, 32)
	search := c.Query("search")

	products, _, err := posService().GetProducts(uint(companyID), uint(categoryID), search, 1, 100)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Products fetched successfully", products)
}

func GetAppPosDeliveries(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	deliveries, _, err := posService().GetDeliveries(uint(companyID), 1, 100)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Deliveries fetched successfully", deliveries)
}

func GetAppPosLevels(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	levels, _, err := posService().GetLevels(uint(companyID), 1, 100)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Levels fetched successfully", levels)
}

func GetAppPosExtras(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	extras, _, err := posService().GetExtras(uint(companyID), 1, 100)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Extras fetched successfully", extras)
}

func CreateAppPosOrder(c *fiber.Ctx) error {
	companyID, _ := strconv.ParseUint(c.Params("company_id"), 10, 32)
	req := new(dto.PosOrderRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	order, err := posService().CreateOrder(uint(companyID), 0, req) // userID 0 for app orders
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Order created successfully", order)
}

// Levels
func GetPosLevels(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	levels, pagination, err := posService().GetLevels(companyID, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Levels fetched successfully", fiber.Map{
		"items":      levels,
		"pagination": pagination,
	})
}

func GetPosLevelDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	level, err := posService().GetLevel(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Level not found")
	}
	return utils.SuccessResponse(c, "Level fetched successfully", level)
}

func CreatePosLevel(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	req := new(dto.PosLevelRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	level, err := posService().CreateLevel(companyID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Level created successfully", level)
}

func UpdatePosLevel(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosLevelRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	level, err := posService().UpdateLevel(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Level updated successfully", level)
}

func DeletePosLevel(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteLevel(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Level deleted successfully", nil)
}

// Extras
func GetPosExtras(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	extras, pagination, err := posService().GetExtras(companyID, page, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Extras fetched successfully", fiber.Map{
		"items":      extras,
		"pagination": pagination,
	})
}

func GetPosExtraDetail(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	extra, err := posService().GetExtra(companyID, uint(id))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Extra not found")
	}
	return utils.SuccessResponse(c, "Extra fetched successfully", extra)
}

func CreatePosExtra(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	req := new(dto.PosExtraRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	extra, err := posService().CreateExtra(companyID, req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Extra created successfully", extra)
}

func UpdatePosExtra(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	req := new(dto.PosExtraRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	extra, err := posService().UpdateExtra(companyID, uint(id), req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Extra updated successfully", extra)
}

func DeletePosExtra(c *fiber.Ctx) error {
	companyID, err := getCompanyID(c)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
	if err := posService().DeleteExtra(companyID, uint(id)); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}
	return utils.SuccessResponse(c, "Extra deleted successfully", nil)
}
