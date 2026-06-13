package main

import (
	"log"
	"pos-backend/internal/models"
	"pos-backend/pkg/database"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()

	companyID := uint(9)

	categories := []models.PosCategory{
		{ID: 991, CompanyID: companyID, Name: "Coffee"},
		{ID: 992, CompanyID: companyID, Name: "Non-Coffee"},
		{ID: 993, CompanyID: companyID, Name: "Pastry"},
		{ID: 994, CompanyID: companyID, Name: "Signature"},
	}

	for _, cat := range categories {
		database.DB.Save(&cat) // Use Save to upsert or create with specific ID
	}

	levels := []models.PosLevel{
		{ID: 771, CompanyID: companyID, Name: "Hot"},
		{ID: 772, CompanyID: companyID, Name: "Ice"},
		{ID: 773, CompanyID: companyID, Name: "Normal Sweetness"},
		{ID: 774, CompanyID: companyID, Name: "Less Sugar"},
	}
	for _, lvl := range levels {
		database.DB.Save(&lvl)
	}

	extras := []models.PosExtra{
		{ID: 661, CompanyID: companyID, Name: "Extra Shot Espresso", Price: "5000"},
		{ID: 662, CompanyID: companyID, Name: "Oat Milk", Price: "8000"},
		{ID: 663, CompanyID: companyID, Name: "Vanilla Syrup", Price: "4000"},
		{ID: 664, CompanyID: companyID, Name: "Vanilla Ice Cream", Price: "10000"},
	}
	for _, ext := range extras {
		database.DB.Save(&ext)
	}

	products := []models.PosProduct{
		{ID: 881, CompanyID: companyID, CategoryID: 991, Name: "Caffe Latte", SKU: "CL-01", Price: 25000, CostPrice: 10000, StockQuantity: 100, IsAvailable: true, LevelIDs: "[771, 772]", ExtraIDs: "[661, 662, 663]"},
		{ID: 882, CompanyID: companyID, CategoryID: 991, Name: "Americano", SKU: "AM-01", Price: 20000, CostPrice: 8000, StockQuantity: 100, IsAvailable: true, LevelIDs: "[771, 772]", ExtraIDs: "[661]"},
		{ID: 883, CompanyID: companyID, CategoryID: 994, Name: "Kopi Susu Senja", SKU: "KS-01", Price: 28000, CostPrice: 12000, StockQuantity: 100, IsAvailable: true, LevelIDs: "[772, 773, 774]", ExtraIDs: "[661, 662, 664]"},
		{ID: 884, CompanyID: companyID, CategoryID: 992, Name: "Matcha Latte", SKU: "ML-01", Price: 30000, CostPrice: 15000, StockQuantity: 100, IsAvailable: true, LevelIDs: "[771, 772]", ExtraIDs: "[662, 664]"},
		{ID: 885, CompanyID: companyID, CategoryID: 993, Name: "Butter Croissant", SKU: "BC-01", Price: 22000, CostPrice: 10000, StockQuantity: 50, IsAvailable: true, LevelIDs: "[]", ExtraIDs: "[]"},
		{ID: 886, CompanyID: companyID, CategoryID: 993, Name: "Fudgy Brownie", SKU: "FB-01", Price: 25000, CostPrice: 12000, StockQuantity: 40, IsAvailable: true, LevelIDs: "[]", ExtraIDs: "[664]"},
	}

	for _, prod := range products {
		database.DB.Save(&prod)
	}

	log.Println("Successfully seeded dummy categories and products for Company 9!")
}
