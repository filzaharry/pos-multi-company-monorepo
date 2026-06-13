package models

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	Name               string         `gorm:"size:255;not null" json:"name"`
	Email              string         `gorm:"size:255;not null;unique" json:"email"`
	Phone              string         `gorm:"size:50" json:"phone"`
	Address            string         `gorm:"type:text" json:"address"`
	LogoURL            string         `gorm:"size:255" json:"logo_url"`
	BannerURL          string         `gorm:"size:255" json:"banner_url"`
	Route              string         `gorm:"size:255;unique" json:"route"`
	Status             int            `gorm:"default:1" json:"status"` // 0: Pending, 1: Active, 2: Suspended
	SubscriptionEndDate *time.Time    `json:"subscription_end_date"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Subscriptions      []CompanySubscription `gorm:"foreignKey:CompanyID" json:"subscriptions,omitempty"`
}

type GeneralParameter struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CompanyID   *uint          `json:"company_id"` // NULL means global setting
	ParamKey    string         `gorm:"size:255;not null" json:"param_key"`
	ParamValue  string         `gorm:"type:text;not null" json:"param_value"`
	Description string         `gorm:"type:text" json:"description"`
	Status      int            `gorm:"default:1" json:"status"` // 0: Non-Aktif, 1: Aktif
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company     Company        `gorm:"foreignKey:CompanyID" json:"-"`
}
