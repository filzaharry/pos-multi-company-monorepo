package models

import (
	"time"

	"gorm.io/gorm"
)

type PosOrder struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	CompanyID      uint           `gorm:"not null" json:"company_id"`
	UserID         *uint          `json:"user_id"` // Nullable for storefront orders
	Code           string         `gorm:"size:50;uniqueIndex:idx_company_code" json:"code"`
	CustomerName   string         `gorm:"size:255" json:"customer_name"`
	PhoneNumber    string         `gorm:"size:20" json:"phone_number"`
	TotalAmount    float64        `gorm:"type:decimal(16,2);not null" json:"total_amount"`
	TaxAmount      float64        `gorm:"type:decimal(16,2);default:0" json:"tax_amount"`
	DiscountAmount float64        `gorm:"type:decimal(16,2);default:0" json:"discount_amount"`
	DeliveryID     *uint          `json:"delivery_id"`
	PaymentMethod  int            `json:"payment_method"`                   // 0->cash, 1->qris
	PaymentStatus  string         `gorm:"size:50;default:'pending'" json:"payment_status"` // Paid, Pending, Refunded
	Status         int            `gorm:"default:0" json:"status"`                         // 0: order masuk, 1: order terbayar, etc.
	Notes          string         `gorm:"type:text" json:"notes"`
	OrderItems     []PosOrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company        Company        `gorm:"foreignKey:CompanyID" json:"-"`
	User           User           `gorm:"foreignKey:UserID" json:"-"`
	Delivery       PosDelivery    `gorm:"foreignKey:DeliveryID" json:"delivery"`
}

type PosOrderItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	OrderID   uint           `gorm:"not null" json:"order_id"`
	ProductID uint           `gorm:"not null" json:"product_id"`
	Quantity  int            `gorm:"not null" json:"quantity"`
	UnitPrice float64        `gorm:"type:decimal(16,2);not null" json:"unit_price"`
	Subtotal  float64        `gorm:"type:decimal(16,2);not null" json:"subtotal"`
	LevelIDs  string         `gorm:"type:text" json:"level_ids"` // Comma-separated PosLevel IDs
	ExtraIDs  string         `gorm:"type:text" json:"extra_ids"` // Comma-separated PosExtra IDs
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Product   PosProduct     `gorm:"foreignKey:ProductID" json:"product"`
}
