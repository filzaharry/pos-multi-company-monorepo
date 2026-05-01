package middleware

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"pos-backend/pkg/logger"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func APILogger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Process request first to allow handlers to save files and set locals
		err := c.Next()

		// Get log file
		logFile, errLog := logger.GetLogFile()
		if errLog != nil {
			fmt.Printf("Error getting log file: %v\n", errLog)
			return err
		}
		defer logFile.Close()

		// Multi-writer to log to both file and console
		mw := io.MultiWriter(os.Stdout, logFile)

		// Capture request body intelligently
		reqBody := getCleanBody(c)

		// Capture response info
		stop := time.Now()
		latency := stop.Sub(start)
		status := c.Response().StatusCode()
		method := c.Method()
		path := c.Path()
		ip := c.IP()

		// Log entry
		entry := fmt.Sprintf("[%s] %s | %d | %13v | %s | %s\nReq Body: %s\n------------------------------------------------\n",
			stop.Format("2006-01-02 15:04:05"),
			ip,
			status,
			latency,
			method,
			path,
			reqBody,
		)

		fmt.Fprint(mw, entry)

		return err
	}
}

func getCleanBody(c *fiber.Ctx) string {
	contentType := string(c.Request().Header.ContentType())

	// Handle Multipart
	if strings.Contains(contentType, fiber.MIMEMultipartForm) {
		form, err := c.MultipartForm()
		if err != nil {
			return "ERROR PARSING MULTIPART"
		}

		data := make(map[string]interface{})
		for k, v := range form.Value {
			if len(v) > 0 {
				data[k] = v[0]
			}
		}

		// Handle Files
		for k, v := range form.File {
			if len(v) > 0 {
				// Check if we have a saved path in Locals (set by SaveUploadedFile)
				if uploaded, ok := c.Locals("uploaded_files").(map[string]string); ok {
					if path, exists := uploaded[k]; exists {
						data[k] = path
						continue
					}
				}
				data[k] = fmt.Sprintf("[FILE: %s]", v[0].Filename)
			}
		}

		b, _ := json.Marshal(data)
		return string(b)
	}

	// Handle JSON
	body := string(c.Body())
	if body == "" {
		return "EMPTY"
	}

	// Optional: You could JSON validate and re-marshal for consistent formatting
	return body
}
