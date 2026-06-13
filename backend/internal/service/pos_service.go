package service

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"strconv"
	"strings"
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
	DeleteOrder(companyID uint, id uint) error

	// Deliveries
	GetDeliveries(companyID uint, page, limit int) ([]models.PosDelivery, models.Pagination, error)
	GetDelivery(companyID uint, id uint) (models.PosDelivery, error)
	CreateDelivery(companyID uint, req *dto.PosDeliveryRequest) (models.PosDelivery, error)
	UpdateDelivery(companyID uint, id uint, req *dto.PosDeliveryRequest) (models.PosDelivery, error)
	DeleteDelivery(companyID uint, id uint) error

	// Levels
	GetLevels(companyID uint, page, limit int) ([]models.PosLevel, models.Pagination, error)
	GetLevel(companyID uint, id uint) (models.PosLevel, error)
	CreateLevel(companyID uint, req *dto.PosLevelRequest) (models.PosLevel, error)
	UpdateLevel(companyID uint, id uint, req *dto.PosLevelRequest) (models.PosLevel, error)
	DeleteLevel(companyID uint, id uint) error

	// Extras
	GetExtras(companyID uint, page, limit int) ([]models.PosExtra, models.Pagination, error)
	GetExtra(companyID uint, id uint) (models.PosExtra, error)
	CreateExtra(companyID uint, req *dto.PosExtraRequest) (models.PosExtra, error)
	UpdateExtra(companyID uint, id uint, req *dto.PosExtraRequest) (models.PosExtra, error)
	DeleteExtra(companyID uint, id uint) error

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
		LevelIDs:      uintsToString(req.LevelIDs),
		ExtraIDs:      uintsToString(req.ExtraIDs),
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
	if req.ImageURL != "" {
		product.ImageURL = req.ImageURL
	}
	product.TrackStock = req.TrackStock
	product.IsAvailable = req.IsAvailable
	product.LevelIDs = uintsToString(req.LevelIDs)
	product.ExtraIDs = uintsToString(req.ExtraIDs)

	err = s.repo.UpdateProduct(&product)
	return product, err
}

func uintsToString(ids []uint) string {
	if len(ids) == 0 {
		return ""
	}
	var strIDs []string
	for _, id := range ids {
		strIDs = append(strIDs, strconv.FormatUint(uint64(id), 10))
	}
	return strings.Join(strIDs, ",")
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
	var pUserID *uint
	if userID != 0 {
		pUserID = &userID
	}

	var pDeliveryID *uint
	if req.DeliveryID != 0 {
		pDeliveryID = &req.DeliveryID
	}

	order := models.PosOrder{
		CompanyID:      companyID,
		UserID:         pUserID,
		CustomerName:   req.CustomerName,
		PhoneNumber:    req.PhoneNumber,
		TotalAmount:    req.TotalAmount,
		TaxAmount:      req.TaxAmount,
		DiscountAmount: req.DiscountAmount,
		DeliveryID:     pDeliveryID,
		PaymentMethod:  req.PaymentMethod,
		PaymentStatus:  req.PaymentStatus,
		Status:         req.Status,
		Notes:          req.Notes,
	}

	for _, item := range req.OrderItems {
		order.OrderItems = append(order.OrderItems, models.PosOrderItem{
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			UnitPrice: item.UnitPrice,
			Subtotal:  item.Subtotal,
			LevelIDs:  uintsToString(item.LevelIDs),
			ExtraIDs:  uintsToString(item.ExtraIDs),
		})
	}

	err := s.repo.CreateOrder(&order)
	return order, err
}

func (s *posService) UpdateOrder(companyID uint, id uint, req *dto.PosUpdateOrderStatusRequest) (models.PosOrder, error) {
	order, err := s.repo.GetOrderByID(companyID, id)
	if err != nil {
		return order, err
	}
	order.PaymentStatus = req.PaymentStatus
	order.Status = req.Status
	order.Notes = req.Notes
	err = s.repo.UpdateOrder(&order)
	return order, err
}

func (s *posService) DeleteOrder(companyID uint, id uint) error {
	return s.repo.DeleteOrder(companyID, id)
}

// Deliveries
func (s *posService) GetDeliveries(companyID uint, page, limit int) ([]models.PosDelivery, models.Pagination, error) {
	return s.repo.GetAllDeliveries(companyID, page, limit)
}

func (s *posService) GetDelivery(companyID uint, id uint) (models.PosDelivery, error) {
	return s.repo.GetDeliveryByID(companyID, id)
}

func (s *posService) CreateDelivery(companyID uint, req *dto.PosDeliveryRequest) (models.PosDelivery, error) {
	delivery := models.PosDelivery{
		CompanyID:   companyID,
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
	}
	err := s.repo.CreateDelivery(&delivery)
	return delivery, err
}

func (s *posService) UpdateDelivery(companyID uint, id uint, req *dto.PosDeliveryRequest) (models.PosDelivery, error) {
	delivery, err := s.repo.GetDeliveryByID(companyID, id)
	if err != nil {
		return delivery, err
	}
	delivery.Name = req.Name
	delivery.Description = req.Description
	delivery.Price = req.Price
	
	err = s.repo.UpdateDelivery(&delivery)
	return delivery, err
}

func (s *posService) DeleteDelivery(companyID uint, id uint) error {
	return s.repo.DeleteDelivery(companyID, id)
}

// Levels
func (s *posService) GetLevels(companyID uint, page, limit int) ([]models.PosLevel, models.Pagination, error) {
	return s.repo.GetAllLevels(companyID, page, limit)
}

func (s *posService) GetLevel(companyID uint, id uint) (models.PosLevel, error) {
	return s.repo.GetLevelByID(companyID, id)
}

func (s *posService) CreateLevel(companyID uint, req *dto.PosLevelRequest) (models.PosLevel, error) {
	level := models.PosLevel{
		CompanyID:   companyID,
		Name:        req.Name,
		Description: req.Description,
	}
	err := s.repo.CreateLevel(&level)
	return level, err
}

func (s *posService) UpdateLevel(companyID uint, id uint, req *dto.PosLevelRequest) (models.PosLevel, error) {
	level, err := s.repo.GetLevelByID(companyID, id)
	if err != nil {
		return level, err
	}
	level.Name = req.Name
	level.Description = req.Description
	err = s.repo.UpdateLevel(&level)
	return level, err
}

func (s *posService) DeleteLevel(companyID uint, id uint) error {
	return s.repo.DeleteLevel(companyID, id)
}

// Extras
func (s *posService) GetExtras(companyID uint, page, limit int) ([]models.PosExtra, models.Pagination, error) {
	return s.repo.GetAllExtras(companyID, page, limit)
}

func (s *posService) GetExtra(companyID uint, id uint) (models.PosExtra, error) {
	return s.repo.GetExtraByID(companyID, id)
}

func (s *posService) CreateExtra(companyID uint, req *dto.PosExtraRequest) (models.PosExtra, error) {
	extra := models.PosExtra{
		CompanyID: companyID,
		Name:      req.Name,
		Price:     req.Price,
	}
	err := s.repo.CreateExtra(&extra)
	return extra, err
}

func (s *posService) UpdateExtra(companyID uint, id uint, req *dto.PosExtraRequest) (models.PosExtra, error) {
	extra, err := s.repo.GetExtraByID(companyID, id)
	if err != nil {
		return extra, err
	}
	extra.Name = req.Name
	extra.Price = req.Price
	err = s.repo.UpdateExtra(&extra)
	return extra, err
}

func (s *posService) DeleteExtra(companyID uint, id uint) error {
	return s.repo.DeleteExtra(companyID, id)
}

func (s *posService) GetStats(companyID uint) (map[string]interface{}, error) {
	return s.repo.GetDashboardStats(companyID)
}
