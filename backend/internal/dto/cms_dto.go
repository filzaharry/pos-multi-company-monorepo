package dto

type NewsRequest struct {
	Title     string `json:"title" validate:"required"`
	BannerURL string `json:"banner_url"`
	Content   string `json:"content" validate:"required"`
}

type FAQRequest struct {
	Title    string `json:"title" validate:"required"`
	Subtitle string `json:"subtitle" validate:"required"`
}

type TNCRequest struct {
	Content string `json:"content" validate:"required"`
}
