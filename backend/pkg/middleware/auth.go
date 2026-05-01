package middleware

import (
	"os"
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func AuthRequired(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Missing authorization header")
	}

	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "default_secret"
	}

	token, err := jwt.ParseWithClaims(tokenString, &utils.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid or expired token")
	}

	claims, ok := token.Claims.(*utils.JWTClaims)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid token claims")
	}

	// Store claims in context
	c.Locals("user_id", claims.UserID)
	c.Locals("email", claims.Email)
	c.Locals("company_id", claims.CompanyID)
	c.Locals("role_id", claims.RoleID)
	c.Locals("role_name", claims.RoleName)

	// 3. Check Subscription Validity (Skip for Super Admin)
	if claims.RoleID != nil && *claims.RoleID != 1 && claims.CompanyID != nil {
		var lastSub models.CompanySubscription
		err := database.DB.Where("company_id = ? AND payment_status = 1", *claims.CompanyID).
			Order("end_date desc").First(&lastSub).Error

		if err != nil || lastSub.EndDate == nil || lastSub.EndDate.Before(time.Now()) {
			return utils.ErrorResponse(c, fiber.StatusForbidden, "Your subscription has expired. Please renew to continue using the services.")
		}
	}

	return c.Next()
}
