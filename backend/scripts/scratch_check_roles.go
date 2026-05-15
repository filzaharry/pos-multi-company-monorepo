//go:build ignore

package main

import (
	"fmt"
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()
	
	var roles []models.Role
	database.DB.Find(&roles)
	for _, r := range roles {
		fmt.Printf("ID: %d, Name: %s\n", r.ID, r.Name)
	}
}
