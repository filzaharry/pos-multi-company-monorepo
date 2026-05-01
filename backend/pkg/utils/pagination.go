// pkg/utils/pagination.go
package utils

import (
	"math"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type FilterParams struct {
	Page      int    `query:"page"`
	Limit     int    `query:"limit"`
	Search    string `query:"search"`
	Status    string `query:"status"`
	SortKey   string `query:"sort_key"`
	SortOrder string `query:"sort_order"`
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

type Pagination struct {
	Total    int64 `json:"total"`
	Page     int   `json:"page"`
	Limit    int   `json:"limit"`
	LastPage int   `json:"last_page"`
}

func GetPaginationParams(c *fiber.Ctx) (int, int, int) {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit
	return page, limit, offset
}

func Paginate(query *gorm.DB, page, limit int, data interface{}) (Pagination, error) {
	var total int64
	query.Count(&total)

	err := query.Limit(limit).Offset((page - 1) * limit).Find(data).Error
	lastPage := int(math.Ceil(float64(total) / float64(limit)))

	return Pagination{
		Total:    total,
		Page:     page,
		Limit:    limit,
		LastPage: lastPage,
	}, err
}

func ManualPaginate(page, limit int, total int64) Pagination {
	lastPage := int(math.Ceil(float64(total) / float64(limit)))
	if lastPage == 0 {
		lastPage = 1
	}
	return Pagination{
		Total:    total,
		Page:     page,
		Limit:    limit,
		LastPage: lastPage,
	}
}
