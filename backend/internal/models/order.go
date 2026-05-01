package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	FullName      string         `gorm:"size:255;not null" json:"full_name"`
	Email         string         `gorm:"size:255;not null" json:"email"`
	Phone         string         `gorm:"size:50;not null" json:"phone"`
	Company       string         `gorm:"size:255;not null" json:"company"`
	PlanName      string         `gorm:"size:100;not null" json:"plan_name"`
	Amount        float64        `gorm:"not null" json:"amount"`
	PaymentMethod string         `gorm:"size:50;not null" json:"payment_method"`
	ReceiptPath   string         `gorm:"size:255" json:"receipt_path"`
	Status        string         `gorm:"size:50;default:'pending'" json:"status"` // pending, active, cancelled
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
