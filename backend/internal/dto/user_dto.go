package dto

type CreateUserRequest struct {
	Name      string `json:"name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Phone     string `json:"phone" validate:"required"`
	Password  string `json:"password" validate:"required,min=6"`
	RoleID    uint   `json:"role_id" validate:"required"`
	CompanyID *uint  `json:"company_id"`
}

type UpdateUserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email" validate:"omitempty,email"`
	Phone    string `json:"phone"`
	Password string `json:"password" validate:"omitempty,min=6"`
	RoleID   uint   `json:"role_id"`
}
