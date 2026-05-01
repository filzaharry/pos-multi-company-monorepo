package utils

import (
	"encoding/json"
	"fmt"
	"pos-backend/pkg/logger"
	"time"
)

// LogActivity writes an activity log to a file named by current date
func LogActivity(action string, details interface{}) {
	now := time.Now()

	f, err := logger.GetLogFile()
	if err != nil {
		fmt.Printf("Error opening log file: %v\n", err)
		return
	}
	defer f.Close()


	// Convert details to JSON for better readability in logs
	detailJSON, _ := json.Marshal(details)
	logMessage := fmt.Sprintf("[%s] ACTION: %s | DETAILS: %s\n", now.Format("15:04:05"), action, string(detailJSON))

	if _, err := f.WriteString(logMessage); err != nil {
		fmt.Printf("Error writing to log file: %v\n", err)
	}
}
