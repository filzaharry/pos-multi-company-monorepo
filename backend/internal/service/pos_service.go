package service

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
)

type PosService interface {
	// Categories
	GetCategories(companyID uint, page, limit int) ([]models.PosCategory, models.Pagination, error)
	GetCategory(companyID uint, id uint) (models.PosCategory, error)
	CreateCategory(companyID uint, req *dto.PosCategoryRequest) (models.PosCategory, error)
	UpdateCategory(companyID uint, id uint, req *dto.PosCategoryRequest) (models.PosCategory, error)
	DeleteCategory(companyID uint, id uint) error

	// Products
	GetProducts(companyID uint, categoryID uint, search string, page, limit int) ([]models.PosProduct, models.Pagination, error)
	GetProduct(companyID uint, id uint) (models.PosProduct, error)
	CreateProduct(companyID uint, req *dto.PosProductRequest) (models.PosProduct, error)
	UpdateProduct(companyID uint, id uint, req *dto.PosProductRequest) (models.PosProduct, error)
	DeleteProduct(companyID uint, id uint) error

	// Orders
	GetOrders(companyID uint, page, limit int) ([]models.PosOrder, models.Pagination, error)
	GetOrder(companyID uint, id uint) (models.PosOrder, error)
	CreateOrder(companyID uint, userID uint, req *dto.PosOrderRequest) (models.PosOrder, error)
	UpdateOrder(companyID uint, id uint, req *dto.PosUpdateOrderStatusRequest) (models.PosOrder, error)

	// Stats
	GetStats(companyID uint) (map[string]interface{}, error)
}

type posService struct {
	repo repository.PosRepository
}

func NewPosService(repo repository.PosRepository) PosService {
	return &posService{repo: repo}
}

// Categories
func (s *posService) GetCategories(companyID uint, page, limit int) ([]models.PosCategory, models.Pagination, error) {
	return s.repo.GetAllCategories(companyID, page, limit)
}

func (s *posService) GetCategory(companyID uint, id uint) (models.PosCategory, error) {
	return s.repo.GetCategoryByID(companyID, id)
}

func (s *posService) CreateCategory(companyID uint, req *dto.PosCategoryRequest) (models.PosCategory, error) {
	category := models.PosCategory{
		CompanyID:   companyID,
		Name:        req.Name,
		Description: req.Description,
		SortOrder:   req.SortOrder,
	}
	err := s.repo.CreateCategory(&category)
	return category, err
}

func (s *posService) UpdateCategory(companyID uint, id uint, req *dto.PosCategoryRequest) (models.PosCategory, error) {
	category, err := s.repo.GetCategoryByID(companyID, id)
	if err != nil {
		return category, err
	}
	category.Name = req.Name
	category.Description = req.Description
	category.SortOrder = req.SortOrder
	err = s.repo.UpdateCategory(&category)
	return category, err
}

func (s *posService) DeleteCategory(companyID uint, id uint) error {
	return s.repo.DeleteCategory(companyID, id)
}

// Products
func (s *posService) GetProducts(companyID uint, categoryID uint, search string, page, limit int) ([]models.PosProduct, models.Pagination, error) {
	return s.repo.GetAllProducts(companyID, categoryID, search, page, limit)
}

func (s *posService) GetProduct(companyID uint, id uint) (models.PosProduct, error) {
	return s.repo.GetProductByID(companyID, id)
}

func (s *posService) CreateProduct(companyID uint, req *dto.PosProductRequest) (models.PosProduct, error) {
	product := models.PosProduct{
		CompanyID:     companyID,
		CategoryID:    req.CategoryID,
		ProductType:   req.ProductType,
		Name:          req.Name,
		SKU:           req.SKU,
		Description:   req.Description,
		Price:         req.Price,
		CostPrice:     req.CostPrice,
		StockQuantity: req.StockQuantity,
		ImageURL:      req.ImageURL,
		TrackStock:    req.TrackStock,
		IsAvailable:   req.IsAvailable,
	}
	err := s.repo.CreateProduct(&product)
	return product, err
}

func (s *posService) UpdateProduct(companyID uint, id uint, req *dto.PosProductRequest) (models.PosProduct, error) {
	product, err := s.repo.GetProductByID(companyID, id)
	if err != nil {
		return product, err
	}
	product.CategoryID = req.CategoryID
	product.ProductType = req.ProductType
	product.Name = req.Name
	product.SKU = req.SKU
	product.Description = req.Description
	product.Price = req.Price
	product.CostPrice = req.CostPrice
	product.StockQuantity = req.StockQuantity
	product.ImageURL = req.ImageURL
	product.TrackStock = req.TrackStock
	product.IsAvailable = req.IsAvailable
	err = s.repo.UpdateProduct(&product)
	return product, err
}

func (s *posService) DeleteProduct(companyID uint, id uint) error {
	return s.repo.DeleteProduct(companyID, id)
}

// Orders
func (s *posService) GetOrders(companyID uint, page, limit int) ([]models.PosOrder, models.Pagination, error) {
	return s.repo.GetAllOrders(companyID, page, limit)
}

func (s *posService) GetOrder(companyID uint, id uint) (models.PosOrder, error) {
	return s.repo.GetOrderByID(companyID, id)
}

func (s *posService) CreateOrder(companyID uint, userID uint, req *dto.PosOrderRequest) (models.PosOrder, error) {
	order := models.PosOrder{
		CompanyID:      companyID,
		UserID:         userID,
		CustomerName:   req.CustomerName,
		TotalAmount:    0, // Will calculate
		TaxAmount:      req.TaxAmount,
		DiscountAmount: req.DiscountAmount,
		PaymentMethod:  req.PaymentMethod,
		PaymentStatus:  req.PaymentStatus,
		Notes:          req.Notes,
	}

	var totalAmount float64
	for _, itemReq := range req.OrderItems {
		item := models.PosOrderItem{
			ProductID: itemReq.ProductID,
			Quantity:  itemReq.Quantity,
			UnitPrice: itemReq.UnitPrice,
			Subtotal:  itemReq.Subtotal,
		}
		order.OrderItems = append(order.OrderItems, item)
		totalAmount += item.Subtotal
	}
	order.TotalAmount = (totalAmount + req.TaxAmount) - req.DiscountAmount

	err := s.repo.CreateOrder(&order)
	return order, err
}

func (s *posService) UpdateOrder(companyID uint, id uint, req *dto.PosUpdateOrderStatusRequest) (models.PosOrder, error) {
	order, err := s.repo.GetOrderByID(companyID, id)
	if err != nil {
		return order, err
	}
	order.PaymentStatus = req.PaymentStatus
	order.Notes = req.Notes
	err = s.repo.UpdateOrder(&order)
	return order, err
}

func (s *posService) GetStats(companyID uint) (map[string]interface{}, error) {
	return s.repo.GetDashboardStats(companyID)
}
