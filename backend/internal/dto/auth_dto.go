package dto

type RegisterRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginRequest struct {
	Email      string `json:"email" validate:"required,email"`
	Password   string `json:"password" validate:"required"`
	RememberMe bool   `json:"remember_me"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
	Email       string `json:"email" validate:"required,email"`
	OTP         string `json:"otp" validate:"required,len=6"`
	NewPassword string `json:"new_password" validate:"required,min=6"`
}

type LoginOTPRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	OTP   string `json:"otp" validate:"required,len=6"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}


type RegisterSubscriptionRequest struct {
	FullName      string `form:"full_name" json:"full_name" validate:"required"`
	BusinessEmail string `form:"business_email" json:"business_email" validate:"required,email"`
	PhoneNumber   string `form:"phone_number" json:"phone_number" validate:"required"`
	CompanyName   string `form:"company_name" json:"company_name" validate:"required"`
	PackageID     uint   `form:"package_id" json:"package_id" validate:"required"`
	PaymentMethod int    `form:"payment_method" json:"payment_method" validate:"min=0,max=1"`
}

type UpdateProfileRequest struct {
	Name     string `json:"name" validate:"required"`
	Phone    string `json:"phone"`
	Password string `json:"password" validate:"omitempty,min=6"`
}
