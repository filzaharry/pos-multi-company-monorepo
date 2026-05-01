package models

import (
	"time"
	"gorm.io/gorm"
)

type News struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Title     string         `gorm:"size:255;not null" json:"title"`
	BannerURL string         `gorm:"size:255" json:"banner_url"`
	Content   string         `gorm:"type:text;not null" json:"content"` // Markdown
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (News) TableName() string {
	return "master_news"
}

type FAQ struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Title     string         `gorm:"size:255;not null" json:"title"`
	Subtitle  string         `gorm:"type:text;not null" json:"subtitle"` // Markdown
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (FAQ) TableName() string {
	return "master_faq"
}

type TNC struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Content string `gorm:"type:text;not null" json:"content"` // Markdown
}

func (TNC) TableName() string {
	return "master_tnc"
}
