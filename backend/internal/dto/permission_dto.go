package dto

type PermissionRequest struct {
	MenuID    *uint  `json:"menu_id"`
	Name      string `json:"name" validate:"required"`
	Slug      string `json:"slug" validate:"required"`
	GroupName string `json:"group_name"`
}
