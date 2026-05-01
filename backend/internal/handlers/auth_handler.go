package handlers

import (
	"pos-backend/internal/dto"
	"pos-backend/internal/repository"
	"pos-backend/internal/service"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"

	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

func authService() service.AuthService {
	userRepo := repository.NewUserRepository(database.DB)
	authRepo := repository.NewAuthRepository(database.DB)
	roleRepo := repository.NewRoleRepository(database.DB)
	return service.NewAuthService(userRepo, authRepo, roleRepo)
}

func Register(c *fiber.Ctx) error {
	input := new(dto.RegisterSubscriptionRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	// Handle File Upload
	file, err := c.FormFile("payment_upload")
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Payment upload is required")
	}

	// Create directory if not exists
	uploadDir := "./public/uploads/payments"
	err = os.MkdirAll(uploadDir, 0755)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Could not create upload directory")
	}

	// Generate filename
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	filepath := fmt.Sprintf("%s/%s", uploadDir, filename)

	if err := c.SaveFile(file, filepath); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Could not save file")
	}

	err = authService().SubmitSubscription(input, filepath)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "terimakasih sudah submit, mohon tunggu, kami akan proses, anda akan menerima informasi lebih lanjut melalui bisnis email anda", nil)
}

func LoginOTP(c *fiber.Ctx) error {
	input := new(dto.LoginOTPRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	if err := authService().RequestLoginOTP(input.Email, input.Password); err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, "OTP sent to your email", fiber.Map{"email": input.Email})
}

func VerifyOTP(c *fiber.Ctx) error {
	input := new(dto.VerifyOTPRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	user, accessToken, refreshToken, err := authService().VerifyLoginOTP(input.Email, input.OTP)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, "Login successful", fiber.Map{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func RefreshToken(c *fiber.Ctx) error {
	input := new(dto.RefreshTokenRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	accessToken, refreshToken, err := authService().RefreshToken(input.RefreshToken)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, "Token refreshed successfully", fiber.Map{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func GetMe(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	user, err := authService().GetMe(userID.(uint))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "User not found")
	}

	return utils.SuccessResponse(c, "User fetched successfully", user)
}

func Logout(c *fiber.Ctx) error {
	input := new(dto.RefreshTokenRequest)
	if err := c.BodyParser(input); err != nil {
		// If no body, maybe it's just a simple logout from frontend side
		return utils.SuccessResponse(c, "Logged out successfully", nil)
	}

	authService().Logout(input.RefreshToken)

	return utils.SuccessResponse(c, "Logged out successfully", nil)
}

func ForgotPassword(c *fiber.Ctx) error {
	input := new(dto.ForgotPasswordRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	if err := authService().ForgotPassword(input.Email); err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, err.Error())
	}

	return utils.SuccessResponse(c, "OTP sent to your email", fiber.Map{"email": input.Email})
}

func ResetPassword(c *fiber.Ctx) error {
	input := new(dto.ResetPasswordRequest)
	if err := c.BodyParser(input); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(input); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	if err := authService().ResetPassword(input.Email, input.OTP, input.NewPassword); err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, err.Error())
	}

	return utils.SuccessResponse(c, "Password reset successful", nil)
}

func UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	req := new(dto.UpdateProfileRequest)
	if err := c.BodyParser(req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid input")
	}

	if validationErrors := utils.ValidateStruct(req); validationErrors != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Validation failed", validationErrors)
	}

	if err := authService().UpdateProfile(userID.(uint), req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, "Profile updated successfully", nil)
}
