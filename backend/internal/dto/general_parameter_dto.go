package dto

type GeneralParameterRequest struct {
	CompanyID   *uint  `json:"company_id"`
	ParamKey    string `json:"param_key" validate:"required"`
	ParamValue  string `json:"param_value" validate:"required"`
	Description string `json:"description"`
	Status      int    `json:"status"`
}
