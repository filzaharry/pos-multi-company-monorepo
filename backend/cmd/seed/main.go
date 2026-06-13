package main

import (
	"log"
	"os"
	"time"

	"pos-backend/internal/models"
	"pos-backend/pkg/database"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()

	log.Println("🌱 Starting subscription seeder...")

	// ── 1. Seed Packages ──────────────────────────────────────────────
	packages := []models.CompanySubsPackage{
		{
			Name:         "Starter",
			Description:  "Cocok untuk usaha kecil. Akses POS dasar, 1 outlet, laporan harian.",
			Pricing:      150000,
			DurationDays: 30,
		},
		{
			Name:         "Professional",
			Description:  "Untuk bisnis berkembang. Multi-outlet (3), manajemen stok, laporan mingguan, support prioritas.",
			Pricing:      750000,
			DurationDays: 180,
		},
		{
			Name:         "Enterprise",
			Description:  "Solusi lengkap. Unlimited outlet, API access, dedicated support, custom branding, laporan real-time.",
			Pricing:      2500000,
			DurationDays: 365,
		},
	}

	for i := range packages {
		var existing models.CompanySubsPackage
		if err := database.DB.Where("name = ?", packages[i].Name).First(&existing).Error; err != nil {
			database.DB.Create(&packages[i])
			log.Printf("  ✅ Package created: %s", packages[i].Name)
		} else {
			// Update existing
			existing.Description = packages[i].Description
			existing.Pricing = packages[i].Pricing
			existing.DurationDays = packages[i].DurationDays
			database.DB.Save(&existing)
			packages[i] = existing
			log.Printf("  🔄 Package updated: %s", packages[i].Name)
		}
	}

	// Re-fetch all packages to get IDs
	var allPkgs []models.CompanySubsPackage
	database.DB.Find(&allPkgs)
	pkgMap := map[string]uint{}
	for _, p := range allPkgs {
		pkgMap[p.Name] = p.ID
	}

	// ── 2. Seed Companies ─────────────────────────────────────────────
	now := time.Now()
	past6mo := now.AddDate(0, -6, 0)
	past1yr := now.AddDate(-1, 0, 0)
	past2yr := now.AddDate(-2, 0, 0)
	future6mo := now.AddDate(0, 6, 0)
	future1yr := now.AddDate(1, 0, 0)
	expired := now.AddDate(0, 0, -15) // Expired 15 days ago

	type companyDef struct {
		Company       models.Company
		Subscriptions []models.CompanySubscription
	}

	defs := []companyDef{
		{
			Company: models.Company{
				Name:                "PT Hexa Teknologi",
				Email:               "admin@hexateknologi.com",
				Phone:               "08123456789",
				Route:               "hexa-teknologi",
				Status:              1, // Active
				SubscriptionEndDate: &future1yr,
			},
			Subscriptions: []models.CompanySubscription{
				{
					FullName: "Budi Santoso", BusinessEmail: "admin@hexateknologi.com", PhoneNumber: "08123456789",
					CompanyName: "PT Hexa Teknologi", Route: "hexa-teknologi",
					PackageID: pkgMap["Enterprise"], PaymentMethod: 0, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &past2yr, EndDate: &past1yr,
				},
				{
					FullName: "Budi Santoso", BusinessEmail: "admin@hexateknologi.com", PhoneNumber: "08123456789",
					CompanyName: "PT Hexa Teknologi", Route: "hexa-teknologi",
					PackageID: pkgMap["Enterprise"], PaymentMethod: 0, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &past1yr, EndDate: &now,
				},
				{
					FullName: "Budi Santoso", BusinessEmail: "admin@hexateknologi.com", PhoneNumber: "08123456789",
					CompanyName: "PT Hexa Teknologi", Route: "hexa-teknologi",
					PackageID: pkgMap["Enterprise"], PaymentMethod: 1, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &now, EndDate: &future1yr,
				},
			},
		},
		{
			Company: models.Company{
				Name:                "CV Maju Jaya",
				Email:               "owner@majujaya.co.id",
				Phone:               "08567890123",
				Route:               "maju-jaya",
				Status:              1, // Active
				SubscriptionEndDate: &future6mo,
			},
			Subscriptions: []models.CompanySubscription{
				{
					FullName: "Siti Rahayu", BusinessEmail: "owner@majujaya.co.id", PhoneNumber: "08567890123",
					CompanyName: "CV Maju Jaya", Route: "maju-jaya",
					PackageID: pkgMap["Professional"], PaymentMethod: 1, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &past6mo, EndDate: &now,
				},
				{
					FullName: "Siti Rahayu", BusinessEmail: "owner@majujaya.co.id", PhoneNumber: "08567890123",
					CompanyName: "CV Maju Jaya", Route: "maju-jaya",
					PackageID: pkgMap["Professional"], PaymentMethod: 0, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &now, EndDate: &future6mo,
				},
			},
		},
		{
			Company: models.Company{
				Name:                "Toko Berkah Abadi",
				Email:               "berkah@gmail.com",
				Phone:               "08198765432",
				Route:               "berkah-abadi",
				Status:              2, // Suspended/Expired
				SubscriptionEndDate: &expired,
			},
			Subscriptions: []models.CompanySubscription{
				{
					FullName: "Ahmad Fauzi", BusinessEmail: "berkah@gmail.com", PhoneNumber: "08198765432",
					CompanyName: "Toko Berkah Abadi", Route: "berkah-abadi",
					PackageID: pkgMap["Starter"], PaymentMethod: 0, PaymentStatus: 1,
					PaymentReceipt: "", StartDate: &past6mo, EndDate: &expired,
				},
			},
		},
		{
			Company: models.Company{
				Name:   "PT Digital Nusantara",
				Email:  "contact@digitalnusantara.id",
				Phone:  "08211223344",
				Route:  "digital-nusantara",
				Status: 0, // Pending Registration
			},
			Subscriptions: []models.CompanySubscription{
				{
					FullName: "Dewi Lestari", BusinessEmail: "contact@digitalnusantara.id", PhoneNumber: "08211223344",
					CompanyName: "PT Digital Nusantara", Route: "digital-nusantara",
					PackageID: pkgMap["Professional"], PaymentMethod: 1, PaymentStatus: 0, // Pending
					PaymentReceipt: "",
				},
			},
		},
		{
			Company: models.Company{
				Name:   "Warung Kopi Senja",
				Email:  "senja@warungkopi.com",
				Phone:  "08555667788",
				Route:  "warung-kopi-senja",
				Status: 0, // Pending
			},
			Subscriptions: []models.CompanySubscription{
				{
					FullName: "Rudi Hermawan", BusinessEmail: "senja@warungkopi.com", PhoneNumber: "08555667788",
					CompanyName: "Warung Kopi Senja", Route: "warung-kopi-senja",
					PackageID: pkgMap["Starter"], PaymentMethod: 0, PaymentStatus: 0,
					PaymentReceipt: "",
				},
			},
		},
	}

	for _, def := range defs {
		var existing models.Company
		if err := database.DB.Where("email = ?", def.Company.Email).First(&existing).Error; err != nil {
			// Create
			database.DB.Create(&def.Company)
			log.Printf("  ✅ Company created: %s (Status: %d)", def.Company.Name, def.Company.Status)

			for j := range def.Subscriptions {
				def.Subscriptions[j].CompanyID = &def.Company.ID
				database.DB.Create(&def.Subscriptions[j])
			}
			log.Printf("     └─ %d subscription(s) created", len(def.Subscriptions))
		} else {
			log.Printf("  ⏭️  Company already exists: %s, skipping", existing.Name)
		}
	}

	log.Println("🎉 Seeder completed!")
	os.Exit(0)
}
