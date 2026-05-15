package main

import (
	"log"
	"pos-backend/pkg/database"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()
	
	// Drop the table to clear old constraints
	err := database.DB.Migrator().DropTable("pos_deliveries")
	if err != nil {
		log.Fatalf("Failed to drop table: %v", err)
	}
	
	log.Println("Table pos_deliveries dropped successfully")
}
