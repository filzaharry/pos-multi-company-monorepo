package service

import (
	"errors"
	"pos-backend/internal/models"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"
	"time"

	"pos-backend/internal/dto"
	"pos-backend/pkg/database"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	SubmitSubscription(input *dto.RegisterSubscriptionRequest, receiptPath string) error
	GetMe(userID uint) (models.User, error)
	ForgotPassword(email string) error
	ResetPassword(email, code, newPassword string) error
	RequestLoginOTP(email, password string) error
	VerifyLoginOTP(email, code string) (models.User, string, string, error)
	RefreshToken(refreshToken string) (string, string, error)
	Logout(refreshToken string) error
	UpdateProfile(userID uint, req *dto.UpdateProfileRequest) error
	ApproveSubscription(subscriptionID uint) error
	RenewSubscription(companyID uint, packageID uint, receiptPath string) error
	VerifyResetOTP(email, code string) error
}

type authService struct {
	userRepo repository.UserRepository
	authRepo repository.AuthRepository
	roleRepo repository.RoleRepository
}

func NewAuthService(userRepo repository.UserRepository, authRepo repository.AuthRepository, roleRepo repository.RoleRepository) AuthService {
	return &authService{
		userRepo: userRepo,
		authRepo: authRepo,
		roleRepo: roleRepo,
	}
}

func (s *authService) SubmitSubscription(input *dto.RegisterSubscriptionRequest, receiptPath string) error {
	// Create pending Company header
	companyRoute := strings.ToLower(strings.ReplaceAll(input.CompanyName, " ", "-"))
	company := models.Company{
		Name:   input.CompanyName,
		Email:  input.BusinessEmail,
		Phone:  input.PhoneNumber,
		Route:  companyRoute,
		Status: 0, // Pending registration
	}

	if err := database.DB.Create(&company).Error; err != nil {
		return err
	}

	subscription := models.CompanySubscription{
		CompanyID:      &company.ID,
		FullName:       input.FullName,
		BusinessEmail:  input.BusinessEmail,
		PhoneNumber:    input.PhoneNumber,
		CompanyName:    input.CompanyName,
		Route:          companyRoute,
		PackageID:      input.PackageID,
		PaymentMethod:  input.PaymentMethod,
		PaymentReceipt: receiptPath,
		PaymentStatus:  0, // Pending
	}

	if err := s.authRepo.CreateSubscription(&subscription); err != nil {
		return err
	}

	// Fetch package name
	var pkg models.CompanySubsPackage
	var packageName = "Paket Premium Enterprise"
	if err := database.DB.First(&pkg, input.PackageID).Error; err == nil {
		packageName = pkg.Name
	}

	paymentMethodStr := "Transfer Bank"
	if input.PaymentMethod == 1 {
		paymentMethodStr = "E-Wallet / Online Payment"
	}

	// Send Email
	subject := "Pengajuan Registrasi Langganan POS SaaS Cloud"
	body := utils.GetSubscriptionEmailTemplate(input.FullName, input.CompanyName, packageName, input.PhoneNumber, paymentMethodStr)

	go utils.SendEmail(input.BusinessEmail, subject, body)

	return nil
}

func (s *authService) GetMe(userID uint) (models.User, error) {
	return s.userRepo.GetByID(userID)
}

func (s *authService) ForgotPassword(email string) error {
	if _, err := s.userRepo.GetByEmail(email); err != nil {
		return errors.New("email not found")
	}

	otpCode := utils.GenerateOTP(6)
	otp := models.OTP{
		Email:     email,
		Code:      otpCode,
		ExpiredAt: time.Now().Add(15 * time.Minute),
	}

	if err := s.authRepo.CreateOTP(&otp); err != nil {
		return err
	}

	// Send email
	subject := "Reset Password OTP"
	body := utils.GetForgotPasswordEmailTemplate(otpCode)
	go utils.SendEmail(email, subject, body)

	return nil
}

func (s *authService) ResetPassword(email, code, newPassword string) error {
	otp, err := s.authRepo.GetOTP(email, code)
	if err != nil {
		return errors.New("invalid OTP")
	}

	if time.Now().After(otp.ExpiredAt) {
		return errors.New("OTP expired")
	}

	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return err
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	if err := s.userRepo.Update(&user); err != nil {
		return err
	}

	return s.authRepo.DeleteOTP(&otp)
}

func (s *authService) VerifyResetOTP(email, code string) error {
	otp, err := s.authRepo.GetOTP(email, code)
	if err != nil {
		return errors.New("invalid OTP")
	}

	if time.Now().After(otp.ExpiredAt) {
		return errors.New("OTP expired")
	}

	return nil
}

func (s *authService) RequestLoginOTP(email, password string) error {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return errors.New("user not found")
	}

	// Verify Password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return errors.New("invalid credentials")
	}

	otpCode := utils.GenerateOTP(6)
	otp := models.OTP{
		Email:     user.Email,
		Code:      otpCode,
		ExpiredAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.authRepo.CreateOTP(&otp); err != nil {
		return err
	}

	// Send email
	subject := "Login OTP"
	body := utils.GetLoginOTPEmailTemplate(otpCode)
	go utils.SendEmail(email, subject, body)

	return nil
}

func (s *authService) VerifyLoginOTP(email, code string) (models.User, string, string, error) {
	otp, err := s.authRepo.GetOTP(email, code)
	if err != nil {
		return models.User{}, "", "", errors.New("invalid OTP")
	}

	if time.Now().After(otp.ExpiredAt) {
		return models.User{}, "", "", errors.New("OTP expired")
	}

	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return models.User{}, "", "", err
	}

	// Generate Access Token (15 minutes)
	accessToken, err := utils.GenerateJWT(user.ID, user.Email, user.CompanyID, user.RoleID, user.Role.Name, 15*time.Minute)
	if err != nil {
		return models.User{}, "", "", err
	}

	// Generate Refresh Token (30 days)
	refreshTokenStr := utils.GenerateRandomToken(64)
	refreshToken := models.RefreshToken{
		UserID:    user.ID,
		Token:     refreshTokenStr,
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}

	if err := s.authRepo.SaveRefreshToken(&refreshToken); err != nil {
		return models.User{}, "", "", err
	}

	s.authRepo.DeleteOTP(&otp)

	return user, accessToken, refreshTokenStr, nil
}

func (s *authService) RefreshToken(tokenStr string) (string, string, error) {
	rt, err := s.authRepo.GetRefreshToken(tokenStr)
	if err != nil {
		return "", "", errors.New("invalid refresh token")
	}

	if time.Now().After(rt.ExpiresAt) {
		s.authRepo.DeleteRefreshToken(tokenStr)
		return "", "", errors.New("refresh token expired")
	}

	user, err := s.userRepo.GetByID(rt.UserID)
	if err != nil {
		return "", "", err
	}

	// Generate new Access Token
	newAccessToken, err := utils.GenerateJWT(user.ID, user.Email, user.CompanyID, user.RoleID, user.Role.Name, 15*time.Minute)
	if err != nil {
		return "", "", err
	}

	// Rotate Refresh Token
	newRefreshTokenStr := utils.GenerateRandomToken(64)
	newRefreshToken := models.RefreshToken{
		UserID:    user.ID,
		Token:     newRefreshTokenStr,
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour),
	}

	if err := s.authRepo.SaveRefreshToken(&newRefreshToken); err != nil {
		return "", "", err
	}

	// Delete old refresh token
	s.authRepo.DeleteRefreshToken(tokenStr)

	return newAccessToken, newRefreshTokenStr, nil
}

func (s *authService) Logout(tokenStr string) error {
	return s.authRepo.DeleteRefreshToken(tokenStr)
}

func (s *authService) UpdateProfile(userID uint, req *dto.UpdateProfileRequest) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	user.Name = req.Name
	user.Phone = req.Phone

	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashedPassword)
	}

	return s.userRepo.Update(&user)
}

func (s *authService) ApproveSubscription(subscriptionID uint) error {
	sub, err := s.authRepo.GetSubscriptionByID(subscriptionID)
	if err != nil {
		return err
	}

	if sub.PaymentStatus != 0 {
		return errors.New("subscription is already processed")
	}

	// Get Package info to calculate duration (assume 1 month for now)
	// We might need a packageRepo or just raw DB
	// For simplicity, I'll fetch it here
	var pkg models.CompanySubsPackage
	if err := database.DB.First(&pkg, sub.PackageID).Error; err != nil {
		return errors.New("package not found")
	}

	now := time.Now()
	var startDate time.Time
	var endDate time.Time

	if sub.CompanyID == nil {
		return errors.New("company not found for this subscription")
	}

	// Fetch Company
	var company models.Company
	if err := database.DB.First(&company, *sub.CompanyID).Error; err != nil {
		return err
	}

	// Calculate End Date
	startDate = now
	
	// Check if this is a renewal (if company is already active and not expired)
	if company.Status == 1 && company.SubscriptionEndDate != nil && company.SubscriptionEndDate.After(now) {
		startDate = *company.SubscriptionEndDate
	}

	endDate = startDate.AddDate(0, 0, pkg.DurationDays)

	sub.StartDate = &startDate
	sub.EndDate = &endDate
	sub.PaymentStatus = 1

	company.SubscriptionEndDate = &endDate

	return s.authRepo.ApproveSubscription(&sub, &company)

}

func (s *authService) RenewSubscription(companyID uint, packageID uint, receiptPath string) error {
	// Get company info
	var company models.Company
	if err := database.DB.First(&company, companyID).Error; err != nil {
		return err
	}

	subscription := models.CompanySubscription{
		CompanyID:      &companyID,
		FullName:       company.Name, // Using company name as placeholder or we could use user name
		BusinessEmail:  company.Email,
		PhoneNumber:    company.Phone,
		CompanyName:    company.Name,
		PackageID:      packageID,
		PaymentReceipt: receiptPath,
		PaymentStatus:  0, // Pending
	}

	return s.authRepo.CreateSubscription(&subscription)
}
