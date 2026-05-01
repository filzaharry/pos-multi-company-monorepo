package models

import (
	"time"
)

type OTP struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"size:255;not null;index" json:"email"`
	Code      string    `gorm:"size:6;not null" json:"code"`
	ExpiredAt time.Time `json:"expired_at"`
	CreatedAt time.Time `json:"created_at"`
}
