//go:build ignore

package main

import (
	"fmt"
	"log"
	"pos-backend/internal/models"
	"pos-backend/pkg/database"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	database.Connect()

	db := database.DB

	fmt.Println("Seeding Landing Page Data...")

	seedPackages(db)
	seedTestimonials(db)
	seedNews(db)
	seedFAQ(db)
	seedTNC(db)

	fmt.Println("Seeding completed successfully!")
}

func seedPackages(db *gorm.DB) {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.CompanySubsPackage{})
	packages := []models.CompanySubsPackage{
		{Name: "Basic", Description: "1 Digital Register, Basic Sales Analytics, Standard Email Support", Pricing: 29.0},
		{Name: "Professional", Description: "5 Digital Registers, Advanced AI Reports, Priority 24/7 Support, Inventory Forecasting", Pricing: 79.0},
		{Name: "Enterprise", Description: "Unlimited Registers, Custom API Integration, Dedicated Account Manager", Pricing: 149.0},
	}
	for _, p := range packages {
		db.Create(&p)
	}
	fmt.Println("✓ Packages seeded")
}

func seedTestimonials(db *gorm.DB) {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.Testimonial{})
	testimonials := []models.Testimonial{
		{Name: "Sarah Johnson", Role: "Boutique Owner", Content: "This POS system completely transformed how we handle inventory. Very easy to use!", Avatar: "https://i.pravatar.cc/150?img=1", Status: "approved", Rating: 5},
		{Name: "Michael Chen", Role: "Restaurant Manager", Content: "Fast, reliable, and the support team is incredible. Highly recommended for F&B.", Avatar: "https://i.pravatar.cc/150?img=11", Status: "approved", Rating: 5},
		{Name: "Emma Davis", Role: "Retail Chain Director", Content: "Scaling to 10 locations was seamless thanks to the multi-company feature.", Avatar: "https://i.pravatar.cc/150?img=5", Status: "approved", Rating: 5},
	}
	for _, t := range testimonials {
		db.Create(&t)
	}
	fmt.Println("✓ Testimonials seeded")
}

func seedNews(db *gorm.DB) {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.News{})
	news := []models.News{
		{Title: "New AI Features Released", BannerURL: "https://picsum.photos/id/1/800/400", Content: "We are excited to announce our new AI-powered inventory forecasting."},
		{Title: "POS System Wins Retail Award", BannerURL: "https://picsum.photos/id/2/800/400", Content: "Our multi-company POS solution has been recognized as the best software of 2026."},
		{Title: "Integration with Major Accounting Software", BannerURL: "https://picsum.photos/id/3/800/400", Content: "You can now sync all your sales data directly with Xero and QuickBooks."},
	}
	for _, n := range news {
		db.Create(&n)
	}
	fmt.Println("✓ News seeded")
}

func seedFAQ(db *gorm.DB) {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.FAQ{})
	faqs := []models.FAQ{
		{Title: "How long does it take to set up?", Subtitle: "You can get your first register up and running in less than 5 minutes."},
		{Title: "Can I use my existing hardware?", Subtitle: "Yes! Our POS is cloud-based and works on iPads, Android tablets, and PC/Mac."},
		{Title: "Do you offer offline mode?", Subtitle: "Absolutely. You can continue taking payments even if your internet goes down."},
	}
	for _, f := range faqs {
		db.Create(&f)
	}
	fmt.Println("✓ FAQs seeded")
}

func seedTNC(db *gorm.DB) {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.TNC{})
	tnc := models.TNC{
		Content: "# Terms and Conditions\n\nWelcome to our POS SaaS platform. By using our service, you agree to these terms:\n\n1. Use the system responsibly.\n2. We protect your data securely.",
	}
	db.Create(&tnc)
	fmt.Println("✓ TNC seeded")
}
