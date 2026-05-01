package models

import (
	"time"

	"gorm.io/gorm"
)

type PosOrder struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	CompanyID      uint           `gorm:"not null" json:"company_id"`
	UserID         uint           `gorm:"not null" json:"user_id"` // Cashier
	CustomerName   string         `gorm:"size:255" json:"customer_name"`
	TotalAmount    float64        `gorm:"type:decimal(16,2);not null" json:"total_amount"`
	TaxAmount      float64        `gorm:"type:decimal(16,2);default:0" json:"tax_amount"`
	DiscountAmount float64        `gorm:"type:decimal(16,2);default:0" json:"discount_amount"`
	PaymentMethod  string         `gorm:"size:50" json:"payment_method"`                   // Cash, Card, QR, etc.
	PaymentStatus  string         `gorm:"size:50;default:'pending'" json:"payment_status"` // Paid, Pending, Refunded
	Notes          string         `gorm:"type:text" json:"notes"`
	OrderItems     []PosOrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company        Company        `gorm:"foreignKey:CompanyID" json:"-"`
	User           User           `gorm:"foreignKey:UserID" json:"-"`
}

type PosOrderItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	OrderID   uint           `gorm:"not null" json:"order_id"`
	ProductID uint           `gorm:"not null" json:"product_id"`
	Quantity  int            `gorm:"not null" json:"quantity"`
	UnitPrice float64        `gorm:"type:decimal(16,2);not null" json:"unit_price"`
	Subtotal  float64        `gorm:"type:decimal(16,2);not null" json:"subtotal"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Product   PosProduct     `gorm:"foreignKey:ProductID" json:"product"`
}
