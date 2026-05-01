package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func SaveUploadedFile(c *fiber.Ctx, fieldName string, folder string) (string, error) {
	file, err := c.FormFile(fieldName)
	if err != nil {
		return "", err
	}

	// Create directory if not exists
	uploadDir := filepath.Join("public", "uploads", folder)
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	newFilename := fmt.Sprintf("%d-%s%s", time.Now().Unix(), uuid.New().String(), ext)
	filePath := filepath.Join(uploadDir, newFilename)

	// Save file
	if err := c.SaveFile(file, filePath); err != nil {
		return "", err
	}

	// Return public URL path
	resPath := fmt.Sprintf("/public/uploads/%s/%s", folder, newFilename)

	// Save to context for logger
	uploaded, _ := c.Locals("uploaded_files").(map[string]string)
	if uploaded == nil {
		uploaded = make(map[string]string)
	}
	uploaded[fieldName] = resPath
	c.Locals("uploaded_files", uploaded)

	return resPath, nil
}

