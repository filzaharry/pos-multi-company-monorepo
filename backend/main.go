package main

import (
	"log"
	"os"
	"pos-backend/internal/models"
	"pos-backend/internal/routes"
	"pos-backend/pkg/database"
	"pos-backend/pkg/middleware"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to Database
	database.Connect()

	// Run Auto Migrations
	err := database.DB.AutoMigrate(
		&models.Company{},
		&models.Role{},
		&models.Permission{},
		&models.User{},
		&models.GeneralParameter{},
		&models.MasterMenu{},
		&models.PosCategory{},
		&models.PosProduct{},
		&models.PosOrder{},
		&models.PosOrderItem{},
		&models.Testimonial{},
		&models.Order{},
		&models.OTP{},
		&models.RefreshToken{},
		&models.CompanySubsPackage{},
		&models.CompanySubscription{},
		&models.News{},
		&models.FAQ{},
		&models.TNC{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName: "POS Multi-Company API v1",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return utils.ErrorResponse(c, code, err.Error())
		},
	})

	// Middleware
	app.Use(middleware.APILogger())
	app.Use(cors.New())

	// Static files
	app.Static("/public", "./public")

	// Scalar API Documentation
	app.Get("/swagger.json", func(c *fiber.Ctx) error {
		return c.SendFile("./swagger.json")
	})

	app.Get("/docs", func(c *fiber.Ctx) error {
		return c.Type("html").SendString(`
			<!doctype html>
			<html>
			  <head>
			    <title>API Documentation</title>
			    <meta charset="utf-8" />
			    <meta name="viewport" content="width=device-width, initial-scale=1" />
			    <style>
			      body { margin: 0; }
			    </style>
			  </head>
			  <body>
			    <script
			      id="api-reference"
			      data-url="/swagger.json"
			      data-configuration='{"authentication": {"preferredSecurityScheme": "bearerAuth"}}'></script>
			    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
			  </body>
			</html>
		`)
	})

	// Setup Routes
	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(app.Listen(":" + port))
}
