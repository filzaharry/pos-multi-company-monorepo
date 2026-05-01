package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetContextCompanyID returns the company ID to use for scoping queries.
// It prioritizes the X-Company-ID header for Super Admins (impersonation).
// Otherwise, it returns the user's assigned company ID.
func GetContextCompanyID(c *fiber.Ctx) *uint {
	// 1. Check if user is Super Admin and has X-Company-ID header
	userRole := c.Locals("role_name")
	if userRole == "Super Admin" {
		companyIDHeader := c.Get("X-Company-ID")
		if companyIDHeader != "" {
			id, err := strconv.ParseUint(companyIDHeader, 10, 32)
			if err == nil {
				uintID := uint(id)
				return &uintID
			}
		}
	}

	// 2. Fallback to user's assigned company ID
	companyID := c.Locals("company_id")
	if companyID != nil {
		if id, ok := companyID.(*uint); ok {
			return id
		}
	}

	return nil
}
