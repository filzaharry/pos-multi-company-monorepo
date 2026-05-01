package dto

type RoleRequest struct {
	CompanyID   *uint  `json:"company_id"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

type UpdateRolePermissionsRequest struct {
	PermissionIDs []uint `json:"permission_ids" validate:"required"`
}
