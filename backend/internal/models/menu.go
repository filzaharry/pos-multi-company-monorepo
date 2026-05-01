package models

import (
	"time"

	"gorm.io/gorm"
)

type MasterMenu struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Name           string         `gorm:"size:100;not null" json:"name"`
	GroupName      string         `gorm:"size:100;default:''" json:"group_name"` // Header for grouping
	Path           string         `gorm:"size:255" json:"path"`
	Icon           string         `gorm:"size:100" json:"icon"`
	Type           string         `gorm:"size:50;default:'item'" json:"type"` // parent, child, item
	ParentID       *uint          `json:"parent_id"`
	SortOrder      int            `gorm:"default:0" json:"sort_order"`
	Status         int            `gorm:"default:1" json:"status"` // 0: disable, 1: enable
	PermissionSlug *string        `gorm:"size:100" json:"permission_slug"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	Parent         *MasterMenu    `gorm:"foreignKey:ParentID" json:"-"`
	Children       []MasterMenu   `gorm:"foreignKey:ParentID" json:"children,omitempty"`
}
