package dto

type PosCategoryRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
}

type PosProductRequest struct {
	CategoryID    uint    `json:"category_id" validate:"required"`
	ProductType   int     `json:"product_type"` // 0: Retail, 1: Food/Drink
	Name          string  `json:"name" validate:"required"`
	SKU           string  `json:"sku"`
	Description   string  `json:"description"`
	Price         float64 `json:"price" validate:"required,gt=0"`
	CostPrice     float64 `json:"cost_price"`
	StockQuantity int     `json:"stock_quantity" validate:"min=0"`
	ImageURL      string  `json:"image_url"`
	TrackStock    bool    `json:"track_stock"`
	IsAvailable   bool    `json:"is_available"`
}

type PosOrderRequest struct {
	CustomerName   string                `json:"customer_name"`
	TaxAmount      float64               `json:"tax_amount"`
	DiscountAmount float64               `json:"discount_amount"`
	PaymentMethod  string                `json:"payment_method" validate:"required"`
	PaymentStatus  string                `json:"payment_status" validate:"required"`
	Notes          string                `json:"notes"`
	OrderItems     []PosOrderItemRequest `json:"order_items" validate:"required,min=1"`
}

type PosOrderItemRequest struct {
	ProductID uint    `json:"product_id" validate:"required"`
	Quantity  int     `json:"quantity" validate:"required,gt=0"`
	UnitPrice float64 `json:"unit_price" validate:"required,gt=0"`
	Subtotal  float64 `json:"subtotal" validate:"required,gt=0"`
}

type PosUpdateOrderStatusRequest struct {
	PaymentStatus string `json:"payment_status" validate:"required"`
	Notes         string `json:"notes"`
}
