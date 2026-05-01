package models

import (
	"time"

	"gorm.io/gorm"
)

type PosCategory struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CompanyID   uint           `gorm:"not null" json:"company_id"`
	Name        string         `gorm:"size:255;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description"`
	SortOrder   int            `gorm:"default:0" json:"sort_order"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company     Company        `gorm:"foreignKey:CompanyID" json:"-"`
}

type PosProduct struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CompanyID     uint           `gorm:"not null" json:"company_id"`
	CategoryID    uint           `gorm:"not null" json:"category_id"`
	ProductType   int            `gorm:"default:0" json:"product_type"`    // 0: Retail (Barang Jadi), 1: Food/Drink (Menu Olahan/Cafe)
	Name          string         `gorm:"size:255;not null" json:"name"`
	SKU           string         `gorm:"size:100" json:"sku"`              // Kode unik barang / Barcode
	Description   string         `gorm:"type:text" json:"description"`
	Price         float64        `gorm:"type:decimal(16,2);not null" json:"price"` // Harga jual ke pelanggan
	CostPrice     float64        `gorm:"type:decimal(16,2)" json:"cost_price"`     // Harga modal dari supplier
	StockQuantity int            `gorm:"default:0" json:"stock_quantity"`          // Jumlah stok fisik saat ini
	ImageURL      string         `gorm:"size:255" json:"image_url"`
	TrackStock    bool           `gorm:"default:true" json:"track_stock"`          // Jika true, stok berkurang otomatis saat terjual
	IsAvailable   bool           `gorm:"default:true" json:"is_available"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company       Company        `gorm:"foreignKey:CompanyID" json:"-"`
	Category      PosCategory    `gorm:"foreignKey:CategoryID" json:"category"`
}
