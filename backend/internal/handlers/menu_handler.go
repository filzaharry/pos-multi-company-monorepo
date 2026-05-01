package handlers

import (
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func GetSidebarMenus(c *fiber.Ctx) error {
	roleID := c.Locals("role_id")
	if roleID == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	// Fetch Role with Permissions
	var role models.Role
	if err := database.DB.Preload("Permissions").First(&role, roleID).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch user permissions")
	}

	// Collect permission slugs
	userPermissions := make(map[string]bool)
	for _, p := range role.Permissions {
		userPermissions[p.Slug] = true
	}

	// Fetch all enabled menus
	var allMenus []models.MasterMenu
	if err := database.DB.Where("status = ?", 1).Order("sort_order asc").Find(&allMenus).Error; err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch menus")
	}

	// Filter menus based on permissions
	var allowedMenus []models.MasterMenu
	isSuperAdmin := role.Name == "Super Admin"

	for _, m := range allMenus {
		if isSuperAdmin || m.PermissionSlug == nil || *m.PermissionSlug == "" || userPermissions[*m.PermissionSlug] {
			allowedMenus = append(allowedMenus, m)
		}
	}

	// Build hierarchy
	menuTree := buildMenuTree(allowedMenus, nil)

	return utils.SuccessResponse(c, "Menus fetched successfully", menuTree)
}

func buildMenuTree(menus []models.MasterMenu, parentID *uint) []models.MasterMenu {
	var tree []models.MasterMenu
	for _, m := range menus {
		if (parentID == nil && m.ParentID == nil) || (parentID != nil && m.ParentID != nil && *m.ParentID == *parentID) {
			m.Children = buildMenuTree(menus, &m.ID)
			tree = append(tree, m)
		}
	}
	return tree
}
