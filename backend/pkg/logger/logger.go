package logger

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

func GetLogFile() (*os.File, error) {
	now := time.Now()
	logDir := "logs"

	// Ensure directory exists
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}

	// File name is today's date: YYYY-MM-DD.log
	fileName := fmt.Sprintf("%s.log", now.Format("2006-01-02"))
	filePath := filepath.Join(logDir, fileName)


	// Open or create file in append mode
	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}

	return file, nil
}
