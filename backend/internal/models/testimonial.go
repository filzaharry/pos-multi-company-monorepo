package models

import (
	"time"

	"gorm.io/gorm"
)

type Testimonial struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name" form:"name"`
	Role      string         `gorm:"size:255" json:"role" form:"role"`
	Content   string         `gorm:"type:text;not null" json:"content" form:"content"`
	Avatar    string         `gorm:"size:255" json:"avatar" form:"avatar"`
	Status    string         `gorm:"size:50;not null;default:'pending'" json:"status" form:"status"`
	Rating    int            `gorm:"default:5" json:"rating" form:"rating"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}
