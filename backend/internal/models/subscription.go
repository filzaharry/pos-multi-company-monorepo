package models

import (
	"time"

	"gorm.io/gorm"
)

type CompanySubsPackage struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:255;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description"` // Fitsur yang didapat
	Pricing     float64        `gorm:"type:decimal(16,2);not null" json:"pricing"`
	CreatedByID uint           `json:"created_by_id"`
	UpdatedByID uint           `json:"updated_by_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

type CompanySubscription struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	CompanyID      *uint          `json:"company_id"` // Nullable for initial registration
	FullName       string         `gorm:"size:255;not null" json:"full_name"`
	BusinessEmail  string         `gorm:"size:255;not null" json:"business_email"`
	PhoneNumber    string         `gorm:"size:50;not null" json:"phone_number"`
	CompanyName    string         `gorm:"size:255;not null" json:"company_name"`
	PackageID      uint           `gorm:"not null" json:"package_id"`
	PaymentMethod  int            `gorm:"not null" json:"payment_method"` // 0: Bank, 1: QRIS
	PaymentReceipt string         `gorm:"size:255" json:"payment_receipt"`
	PaymentStatus  int            `gorm:"default:0" json:"payment_status"` // 0: Pending, 1: Success, 2: Failed
	StartDate      *time.Time     `json:"start_date"`
	EndDate        *time.Time     `json:"end_date"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Package CompanySubsPackage `gorm:"foreignKey:PackageID" json:"package"`
	Company *Company           `gorm:"foreignKey:CompanyID" json:"company"`
}
