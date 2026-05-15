package repository

import (
	"fmt"
	"math/rand"
	"pos-backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type PosRepository interface {
	// Categories
	GetAllCategories(companyID uint, page, limit int) ([]models.PosCategory, models.Pagination, error)
	GetCategoryByID(companyID uint, id uint) (models.PosCategory, error)
	CreateCategory(category *models.PosCategory) error
	UpdateCategory(category *models.PosCategory) error
	DeleteCategory(companyID uint, id uint) error

	// Products
	GetAllProducts(companyID uint, categoryID uint, search string, page, limit int) ([]models.PosProduct, models.Pagination, error)
	GetProductByID(companyID uint, id uint) (models.PosProduct, error)
	CreateProduct(product *models.PosProduct) error
	UpdateProduct(product *models.PosProduct) error
	DeleteProduct(companyID uint, id uint) error

	// Orders
	GetAllOrders(companyID uint, page, limit int) ([]models.PosOrder, models.Pagination, error)
	GetOrderByID(companyID uint, id uint) (models.PosOrder, error)
	CreateOrder(order *models.PosOrder) error
	UpdateOrder(order *models.PosOrder) error
	DeleteOrder(companyID uint, id uint) error

	// Deliveries
	GetAllDeliveries(companyID uint, page, limit int) ([]models.PosDelivery, models.Pagination, error)
	GetDeliveryByID(companyID uint, id uint) (models.PosDelivery, error)
	CreateDelivery(delivery *models.PosDelivery) error
	UpdateDelivery(delivery *models.PosDelivery) error
	DeleteDelivery(companyID uint, id uint) error

	// Levels
	GetAllLevels(companyID uint, page, limit int) ([]models.PosLevel, models.Pagination, error)
	GetLevelByID(companyID uint, id uint) (models.PosLevel, error)
	CreateLevel(level *models.PosLevel) error
	UpdateLevel(level *models.PosLevel) error
	DeleteLevel(companyID uint, id uint) error

	// Extras
	GetAllExtras(companyID uint, page, limit int) ([]models.PosExtra, models.Pagination, error)
	GetExtraByID(companyID uint, id uint) (models.PosExtra, error)
	CreateExtra(extra *models.PosExtra) error
	UpdateExtra(extra *models.PosExtra) error
	DeleteExtra(companyID uint, id uint) error

	// Stats
	GetDashboardStats(companyID uint) (map[string]interface{}, error)
}

type posRepository struct {
	db *gorm.DB
}

func NewPosRepository(db *gorm.DB) PosRepository {
	return &posRepository{db: db}
}

// Categories Implementation
func (r *posRepository) GetAllCategories(companyID uint, page, limit int) ([]models.PosCategory, models.Pagination, error) {
	var categories []models.PosCategory
	query := r.db.Where("company_id = ?", companyID).Order("sort_order asc")

	pagination, err := models.Paginate(query, page, limit, &categories)
	return categories, pagination, err
}

func (r *posRepository) GetCategoryByID(companyID uint, id uint) (models.PosCategory, error) {
	var category models.PosCategory
	err := r.db.Where("company_id = ? AND id = ?", companyID, id).First(&category).Error
	return category, err
}

func (r *posRepository) CreateCategory(category *models.PosCategory) error {
	return r.db.Create(category).Error
}

func (r *posRepository) UpdateCategory(category *models.PosCategory) error {
	return r.db.Save(category).Error
}

func (r *posRepository) DeleteCategory(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosCategory{}).Error
}

// Products Implementation
func (r *posRepository) GetAllProducts(companyID uint, categoryID uint, search string, page, limit int) ([]models.PosProduct, models.Pagination, error) {
	var products []models.PosProduct
	query := r.db.Preload("Category").Where("company_id = ?", companyID)

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}
	if search != "" {
		query = query.Where("name ILIKE ? OR sku ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	pagination, err := models.Paginate(query, page, limit, &products)
	return products, pagination, err
}

func (r *posRepository) GetProductByID(companyID uint, id uint) (models.PosProduct, error) {
	var product models.PosProduct
	err := r.db.Preload("Category").Where("company_id = ? AND id = ?", companyID, id).First(&product).Error
	return product, err
}

func (r *posRepository) CreateProduct(product *models.PosProduct) error {
	return r.db.Create(product).Error
}

func (r *posRepository) UpdateProduct(product *models.PosProduct) error {
	return r.db.Save(product).Error
}

func (r *posRepository) DeleteProduct(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosProduct{}).Error
}

// Orders Implementation
func (r *posRepository) GetAllOrders(companyID uint, page, limit int) ([]models.PosOrder, models.Pagination, error) {
	var orders []models.PosOrder
	query := r.db.Preload("OrderItems.Product").Where("company_id = ?", companyID).Order("created_at desc")

	pagination, err := models.Paginate(query, page, limit, &orders)
	return orders, pagination, err
}

func (r *posRepository) GetOrderByID(companyID uint, id uint) (models.PosOrder, error) {
	var order models.PosOrder
	err := r.db.Preload("OrderItems.Product").Where("company_id = ? AND id = ?", companyID, id).First(&order).Error
	return order, err
}

func (r *posRepository) CreateOrder(order *models.PosOrder) error {
	// Generate unique code: ORD-YYYYMMDD-XXXX
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	source := rand.NewSource(time.Now().UnixNano())
	rng := rand.New(source)
	randomPart := make([]byte, 4)
	for i := range randomPart {
		randomPart[i] = chars[rng.Intn(len(chars))]
	}
	order.Code = fmt.Sprintf("ORD-%s-%s", time.Now().Format("20060102"), string(randomPart))

	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(order).Error; err != nil {
			return err
		}

		for _, item := range order.OrderItems {
			// Get product to check if we should track stock
			var product models.PosProduct
			if err := tx.Select("track_stock").Where("id = ?", item.ProductID).First(&product).Error; err != nil {
				return err
			}

			if product.TrackStock {
				if err := tx.Model(&models.PosProduct{}).
					Where("id = ? AND company_id = ? AND stock_quantity >= ?", item.ProductID, order.CompanyID, item.Quantity).
					Update("stock_quantity", gorm.Expr("stock_quantity - ?", item.Quantity)).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}

func (r *posRepository) UpdateOrder(order *models.PosOrder) error {
	return r.db.Save(order).Error
}

func (r *posRepository) DeleteOrder(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosOrder{}).Error
}

// Deliveries Implementation
func (r *posRepository) GetAllDeliveries(companyID uint, page, limit int) ([]models.PosDelivery, models.Pagination, error) {
	var deliveries []models.PosDelivery
	query := r.db.Where("company_id = ?", companyID).Order("created_at desc")

	pagination, err := models.Paginate(query, page, limit, &deliveries)
	return deliveries, pagination, err
}

func (r *posRepository) GetDeliveryByID(companyID uint, id uint) (models.PosDelivery, error) {
	var delivery models.PosDelivery
	err := r.db.Where("company_id = ? AND id = ?", companyID, id).First(&delivery).Error
	return delivery, err
}

func (r *posRepository) CreateDelivery(delivery *models.PosDelivery) error {
	return r.db.Create(delivery).Error
}

func (r *posRepository) UpdateDelivery(delivery *models.PosDelivery) error {
	return r.db.Save(delivery).Error
}

func (r *posRepository) DeleteDelivery(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosDelivery{}).Error
}

// Levels Implementation
func (r *posRepository) GetAllLevels(companyID uint, page, limit int) ([]models.PosLevel, models.Pagination, error) {
	var levels []models.PosLevel
	query := r.db.Where("company_id = ?", companyID).Order("created_at desc")
	pagination, err := models.Paginate(query, page, limit, &levels)
	return levels, pagination, err
}

func (r *posRepository) GetLevelByID(companyID uint, id uint) (models.PosLevel, error) {
	var level models.PosLevel
	err := r.db.Where("company_id = ? AND id = ?", companyID, id).First(&level).Error
	return level, err
}

func (r *posRepository) CreateLevel(level *models.PosLevel) error {
	return r.db.Create(level).Error
}

func (r *posRepository) UpdateLevel(level *models.PosLevel) error {
	return r.db.Save(level).Error
}

func (r *posRepository) DeleteLevel(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosLevel{}).Error
}

// Extras Implementation
func (r *posRepository) GetAllExtras(companyID uint, page, limit int) ([]models.PosExtra, models.Pagination, error) {
	var extras []models.PosExtra
	query := r.db.Where("company_id = ?", companyID).Order("created_at desc")
	pagination, err := models.Paginate(query, page, limit, &extras)
	return extras, pagination, err
}

func (r *posRepository) GetExtraByID(companyID uint, id uint) (models.PosExtra, error) {
	var extra models.PosExtra
	err := r.db.Where("company_id = ? AND id = ?", companyID, id).First(&extra).Error
	return extra, err
}

func (r *posRepository) CreateExtra(extra *models.PosExtra) error {
	return r.db.Create(extra).Error
}

func (r *posRepository) UpdateExtra(extra *models.PosExtra) error {
	return r.db.Save(extra).Error
}

func (r *posRepository) DeleteExtra(companyID uint, id uint) error {
	return r.db.Where("company_id = ? AND id = ?", companyID, id).Delete(&models.PosExtra{}).Error
}

// Stats Implementation
func (r *posRepository) GetDashboardStats(companyID uint) (map[string]interface{}, error) {
	var stats = make(map[string]interface{})

	var totalRevenue float64
	r.db.Model(&models.PosOrder{}).Where("company_id = ? AND payment_status = ?", companyID, "Paid").Select("COALESCE(SUM(total_amount), 0)").Scan(&totalRevenue)

	var totalOrders int64
	r.db.Model(&models.PosOrder{}).Where("company_id = ?", companyID).Count(&totalOrders)

	var lowStock int64
	r.db.Model(&models.PosProduct{}).Where("company_id = ? AND stock_quantity < 10", companyID).Count(&lowStock)

	stats["total_revenue"] = totalRevenue
	stats["total_orders"] = totalOrders
	stats["low_stock"] = lowStock

	return stats, nil
}
