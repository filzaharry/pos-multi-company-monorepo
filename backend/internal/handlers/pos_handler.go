package handlers

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"

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
