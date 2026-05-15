package dto

type PosCategoryRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
}

type PosProductRequest struct {
	CategoryID    uint    `json:"category_id" form:"category_id" validate:"required"`
	ProductType   int     `json:"product_type" form:"product_type"` // 0: Retail, 1: Food/Drink
	Name          string  `json:"name" form:"name" validate:"required"`
	SKU           string  `json:"sku" form:"sku"`
	Description   string  `json:"description" form:"description"`
	Price         float64 `json:"price" form:"price" validate:"required,gt=0"`
	CostPrice     float64 `json:"cost_price" form:"cost_price"`
	StockQuantity int     `json:"stock_quantity" form:"stock_quantity" validate:"min=0"`
	ImageURL      string  `json:"image_url" form:"image_url"`
	TrackStock    bool    `json:"track_stock" form:"track_stock"`
	IsAvailable   bool    `json:"is_available" form:"is_available"`
	LevelIDs      []uint  `json:"level_ids" form:"level_ids"`
	ExtraIDs      []uint  `json:"extra_ids" form:"extra_ids"`
}

type PosOrderRequest struct {
	CompanyID      uint                  `json:"company_id"`
	CustomerName   string                `json:"customer_name"`
	PhoneNumber    string                `json:"phone_number"`
	TotalAmount    float64               `json:"total_amount"`
	TaxAmount      float64               `json:"tax_amount"`
	DiscountAmount float64               `json:"discount_amount"`
	DeliveryID     uint                  `json:"delivery_id"`
	PaymentMethod  int                   `json:"payment_method"` // 0->cash, 1->qris
	PaymentStatus  string                `json:"payment_status"`
	Status         int                   `json:"status"`
	Notes          string                `json:"notes"`
	OrderItems     []PosOrderItemRequest `json:"order_items" validate:"required,min=1"`
}

type PosOrderItemRequest struct {
	ProductID uint    `json:"product_id" validate:"required"`
	Quantity  int     `json:"quantity" validate:"required,gt=0"`
	UnitPrice float64 `json:"unit_price" validate:"required,gt=0"`
	Subtotal  float64 `json:"subtotal" validate:"required,gt=0"`
	LevelIDs  []uint  `json:"level_ids"`
	ExtraIDs  []uint  `json:"extra_ids"`
}

type PosLevelRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

type PosExtraRequest struct {
	Name  string `json:"name" validate:"required"`
	Price string `json:"price" validate:"required"`
}

type PosUpdateOrderStatusRequest struct {
	PaymentStatus string `json:"payment_status" validate:"required"`
	Status        int    `json:"status"`
	Notes         string `json:"notes"`
}

type PosDeliveryRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	Price       string `json:"price" validate:"required"`
}
