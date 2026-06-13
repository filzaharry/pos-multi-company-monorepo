package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=pos-multi-company port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.Exec("ALTER TABLE pos_orders ALTER COLUMN delivery_id DROP NOT NULL;").Error
	if err != nil {
		log.Fatal("Failed to drop constraint:", err)
	}

	log.Println("Successfully dropped NOT NULL constraint on delivery_id")
}
