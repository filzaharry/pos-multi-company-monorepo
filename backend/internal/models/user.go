package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CompanyID *uint          `json:"company_id"` // NULL for system super admins
	RoleID    *uint          `json:"role_id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Email     string         `gorm:"size:255;not null;unique" json:"email"`
	Phone     string         `gorm:"size:20" json:"phone"`
	Password  string         `gorm:"size:255;not null" json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company   *Company       `gorm:"foreignKey:CompanyID" json:"company,omitempty"`
	Role      Role           `gorm:"foreignKey:RoleID" json:"role"`
}
