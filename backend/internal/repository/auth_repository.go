package repository

import (
	"pos-backend/internal/models"

	"gorm.io/gorm"
)

type AuthRepository interface {
	CreateOTP(otp *models.OTP) error
	GetOTP(email string, code string) (models.OTP, error)
	DeleteOTP(otp *models.OTP) error
	SaveRefreshToken(refreshToken *models.RefreshToken) error
	GetRefreshToken(token string) (models.RefreshToken, error)
	DeleteRefreshToken(token string) error
	DeleteUserRefreshTokens(userID uint) error
	CreateSubscription(sub *models.CompanySubscription) error
	GetSubscriptionByID(id uint) (models.CompanySubscription, error)
	UpdateSubscription(sub *models.CompanySubscription) error
	ApproveSubscription(sub *models.CompanySubscription, company *models.Company) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) CreateOTP(otp *models.OTP) error {
	return r.db.Create(otp).Error
}

func (r *authRepository) GetOTP(email string, code string) (models.OTP, error) {
	var otp models.OTP
	err := r.db.Where("email = ? AND code = ?", email, code).First(&otp).Error
	return otp, err
}

func (r *authRepository) DeleteOTP(otp *models.OTP) error {
	return r.db.Delete(otp).Error
}

func (r *authRepository) SaveRefreshToken(refreshToken *models.RefreshToken) error {
	return r.db.Create(refreshToken).Error
}

func (r *authRepository) GetRefreshToken(token string) (models.RefreshToken, error) {
	var rt models.RefreshToken
	err := r.db.Where("token = ?", token).First(&rt).Error
	return rt, err
}

func (r *authRepository) DeleteRefreshToken(token string) error {
	return r.db.Where("token = ?", token).Delete(&models.RefreshToken{}).Error
}

func (r *authRepository) DeleteUserRefreshTokens(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.RefreshToken{}).Error
}


func (r *authRepository) CreateSubscription(sub *models.CompanySubscription) error {
	return r.db.Create(sub).Error
}

func (r *authRepository) GetSubscriptionByID(id uint) (models.CompanySubscription, error) {
	var sub models.CompanySubscription
	err := r.db.First(&sub, id).Error
	return sub, err
}

func (r *authRepository) UpdateSubscription(sub *models.CompanySubscription) error {
	return r.db.Save(sub).Error
}

func (r *authRepository) ApproveSubscription(sub *models.CompanySubscription, company *models.Company) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Update Company Status and End Date
		company.Status = 1 // Active
		if err := tx.Save(company).Error; err != nil {
			return err
		}

		// 2. Check if User exists, if not create User (Owner/Admin)
		var existingUser int64
		tx.Model(&models.User{}).Where("company_id = ?", company.ID).Count(&existingUser)
		if existingUser == 0 {
			roleID := uint(2)
			user := models.User{
				CompanyID: &company.ID,
				RoleID:    &roleID, // Admin
				Name:      sub.FullName,
				Email:     sub.BusinessEmail,
				Password:  "$2a$10$6IrumSb1b.xiaXf/AOMvh.E/DViP2UQ5c0Xt7KBf9HKHGzRQkGQLa", // Hashed "Password123"
			}
			if err := tx.Create(&user).Error; err != nil {
				return err
			}
		}

		// 3. Update Subscription Status
		sub.PaymentStatus = 1 // Success
		if err := tx.Save(sub).Error; err != nil {
			return err
		}

		return nil
	})
}
