package dto

type TestimonialRequest struct {
	Name    string `json:"name" validate:"required"`
	Content string `json:"content" validate:"required"`
	Status  string `json:"status" validate:"required"`
	Rating  int    `json:"rating" validate:"required,min=1,max=5"`
	Avatar  string `json:"avatar"`
}
