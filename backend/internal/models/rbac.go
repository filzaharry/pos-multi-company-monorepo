package models

import (
	"time"

	"gorm.io/gorm"
)

type Role struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CompanyID   *uint          `json:"company_id"` // NULL for system roles, or specific to company
	Name        string         `gorm:"size:100;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	CompanyName string         `gorm:"->" json:"company_name"`
	Permissions []Permission   `gorm:"many2many:role_permissions;" json:"permissions"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Company     *Company       `gorm:"foreignKey:CompanyID" json:"company,omitempty"`
}

type Permission struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MenuID    *uint     `json:"menu_id"` // Link to MasterMenu
	Name      string    `gorm:"size:100;not null" json:"name"`
	Slug      string    `gorm:"size:100;not null;unique" json:"slug"` // e.g. user.create, menu.view
	GroupName string    `gorm:"size:100" json:"group_name"`           // e.g. User Management
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
