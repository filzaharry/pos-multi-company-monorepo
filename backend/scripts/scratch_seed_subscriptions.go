//go:build ignore

package main

import (
	"fmt"
	"log"
	"pos-backend/internal/models"
	"pos-backend/pkg/database"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	database.Connect()

	db := database.DB

	fmt.Println("Seeding Company Subscriptions Data...")

	seedSubscriptions(db)

	fmt.Println("Seeding completed successfully!")
}

func seedSubscriptions(db *gorm.DB) {
	// Clean existing data
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.CompanySubscription{})

	// Get package IDs
	var packages []models.CompanySubsPackage
	db.Find(&packages)
	if len(packages) == 0 {
		fmt.Println("No packages found. Please run scratch_seed_landing.go first.")
		return
	}

	now := time.Now()
	nextMonth := now.AddDate(0, 1, 0)
	lastMonth := now.AddDate(0, -1, 0)

	subscriptions := []models.CompanySubscription{
		{
			FullName:       "Harry Filza",
			BusinessEmail:  "harry@digisuprem.co.id",
			PhoneNumber:    "08123456789",
			CompanyName:    "Harry POS Store",
			PackageID:      packages[0].ID, // Basic
			PaymentMethod:  0,              // Bank
			PaymentReceipt: "receipt_01.jpg",
			PaymentStatus:  1, // Success
			StartDate:      &lastMonth,
			EndDate:        &nextMonth,
		},
		{
			FullName:       "John Doe",
			BusinessEmail:  "john@example.com",
			PhoneNumber:    "08998877665",
			CompanyName:    "John Coffee Shop",
			PackageID:      packages[1].ID, // Professional
			PaymentMethod:  1,              // QRIS
			PaymentReceipt: "receipt_02.png",
			PaymentStatus:  0, // Pending
		},
		{
			FullName:       "Jane Smith",
			BusinessEmail:  "jane@retail.com",
			PhoneNumber:    "08223344556",
			CompanyName:    "Jane Retail Group",
			PackageID:      packages[2].ID, // Enterprise
			PaymentMethod:  0,              // Bank
			PaymentReceipt: "receipt_03.pdf",
			PaymentStatus:  1, // Success
			StartDate:      &now,
			EndDate:        &nextMonth,
		},
		{
			FullName:       "Bob Wilson",
			BusinessEmail:  "bob@garage.com",
			PhoneNumber:    "08554433221",
			CompanyName:    "Bob Automotive",
			PackageID:      packages[0].ID, // Basic
			PaymentMethod:  1,              // QRIS
			PaymentReceipt: "receipt_04.jpg",
			PaymentStatus:  2, // Failed
		},
	}

	for _, s := range subscriptions {
		if err := db.Create(&s).Error; err != nil {
			fmt.Printf("Error seeding subscription for %s: %v\n", s.CompanyName, err)
		}
	}

	fmt.Println("✓ Company Subscriptions seeded")
}
