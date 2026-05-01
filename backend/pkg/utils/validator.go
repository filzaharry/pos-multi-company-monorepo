package utils

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

type ErrorResponseDetail struct {
	Field   string `json:"field"`
	Tag     string `json:"tag"`
	Message string `json:"message"`
}

func ValidateStruct(s interface{}) []*ErrorResponseDetail {
	var errors []*ErrorResponseDetail
	err := validate.Struct(s)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			element := ErrorResponseDetail{
				Field:   err.Field(),
				Tag:     err.Tag(),
				Message: fmt.Sprintf("Field %s failed validation for tag %s", err.Field(), err.Tag()),
			}
			errors = append(errors, &element)
		}
	}
	return errors
}

func ValidateFile(file *multipart.FileHeader, maxSize int64, allowedExts []string) error {
	if file.Size > maxSize {
		return fmt.Errorf("file size exceeds %dMB", maxSize/(1024*1024))
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	isAllowed := false
	for _, e := range allowedExts {
		if ext == strings.ToLower(e) {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return fmt.Errorf("only %v formats are allowed", allowedExts)
	}

	return nil
}
