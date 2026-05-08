package models

import (
	"math"
	"gorm.io/gorm"
)

type Pagination struct {
	Total    int64 `json:"total"`
	Page     int   `json:"page"`
	Limit    int   `json:"limit"`
	LastPage int   `json:"last_page"`
}

func Paginate(query *gorm.DB, page, limit int, data interface{}) (Pagination, error) {
	var total int64
	
	// Use a clone of the query to count without limit/offset
	countQuery := query.Session(&gorm.Session{})
	countQuery.Count(&total)

	err := query.Limit(limit).Offset((page - 1) * limit).Find(data).Error
	lastPage := int(math.Ceil(float64(total) / float64(limit)))
	if lastPage == 0 {
		lastPage = 1
	}

	return Pagination{
		Total:    total,
		Page:     page,
		Limit:    limit,
		LastPage: lastPage,
	}, err
}
