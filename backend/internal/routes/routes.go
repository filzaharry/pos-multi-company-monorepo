package routes

import (
	"pos-backend/internal/handlers"
	"pos-backend/pkg/middleware"
	"pos-backend/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login/otp", handlers.LoginOTP)
	auth.Post("/login/verify", handlers.VerifyOTP)
	auth.Post("/refresh", handlers.RefreshToken)
	auth.Get("/me", middleware.AuthRequired, handlers.GetMe)
	auth.Put("/profile", middleware.AuthRequired, handlers.UpdateProfile)
	auth.Post("/logout", handlers.Logout)
	auth.Post("/forgot-password", handlers.ForgotPassword)
	auth.Post("/reset-password", handlers.ResetPassword)

	// Landing routes (Public)
	landing := api.Group("/landing")
	landing.Get("/header", handlers.GetLandingHeader)
	landing.Put("/header", middleware.AuthRequired, handlers.UpdateLandingHeader)
	landing.Get("/testimonials", handlers.GetAllTestimonials)
	landing.Get("/faq", handlers.GetAllFAQ)
	landing.Get("/news", handlers.GetAllNews)
	landing.Get("/tnc", handlers.GetTNC)
	landing.Get("/packages", handlers.GetLandingPackages)

	testimonials := api.Group("/testimonials", middleware.AuthRequired)
	testimonials.Get("", handlers.GetAllTestimonials)
	testimonials.Get("/:id", handlers.GetDetailTestimonial)
	testimonials.Post("/", handlers.CreateTestimonial)
	testimonials.Put("/:id", handlers.UpdateTestimonial)
	testimonials.Delete("/:id", handlers.DeleteTestimonial)

	// News routes
	news := api.Group("/news", middleware.AuthRequired)
	news.Get("", handlers.GetAllNews)
	news.Get("/:id", handlers.GetDetailNews)
	news.Post("/", handlers.CreateNews)
	news.Put("/:id", handlers.UpdateNews)
	news.Delete("/:id", handlers.DeleteNews)

	// FAQ routes
	faq := api.Group("/faq", middleware.AuthRequired)
	faq.Get("", handlers.GetAllFAQ)
	faq.Get("/:id", handlers.GetDetailFAQ)
	faq.Post("/", handlers.CreateFAQ)
	faq.Put("/:id", handlers.UpdateFAQ)
	faq.Delete("/:id", handlers.DeleteFAQ)

	// TNC routes
	tnc := api.Group("/tnc", middleware.AuthRequired)
	tnc.Get("/", handlers.GetTNC)
	tnc.Put("/", handlers.UpdateTNC)

	// Order routes
	orders := api.Group("/orders", middleware.AuthRequired)
	orders.Post("/checkout", handlers.CreateOrder)
	orders.Get("/", handlers.GetOrders)

	// Menu routes
	menus := api.Group("/menus", middleware.AuthRequired)
	menus.Get("/sidebar", handlers.GetSidebarMenus)

	// User Management routes
	users := api.Group("/users", middleware.AuthRequired)
	users.Get("", handlers.GetUsers)
	users.Get("/:id", handlers.GetDetailUser)
	users.Post("/", handlers.CreateUser)
	users.Put("/:id", handlers.UpdateUser)
	users.Delete("/:id", handlers.DeleteUser)

	// Role Routes
	roles := api.Group("/roles", middleware.AuthRequired)
	roles.Get("", handlers.GetRoles)
	roles.Get("/:id", handlers.GetDetailRole)
	roles.Post("/", handlers.CreateRole)
	roles.Put("/:id", handlers.UpdateRole)
	roles.Delete("/:id", handlers.DeleteRole)
	roles.Get("/permissions", handlers.GetRolesWithPermissions) // Matrix data
	roles.Put("/:id/permissions", handlers.UpdateRolePermissions)

	// Permission Routes
	permissions := api.Group("/permissions", middleware.AuthRequired)
	permissions.Get("", handlers.GetAllPermissions)
	permissions.Get("/:id", handlers.GetDetailPermission)
	permissions.Post("/", handlers.CreatePermission)
	permissions.Put("/:id", handlers.UpdatePermission)
	permissions.Delete("/:id", handlers.DeletePermission)

	// Subscription Management routes
	subscriptions := api.Group("/subscriptions", middleware.AuthRequired)
	subscriptions.Get("", handlers.GetSubscriptions)
	subscriptions.Get("/stats", handlers.GetSubscriptionStats)
	subscriptions.Get("/:id", handlers.GetDetailSubscription)
	subscriptions.Post("/", handlers.CreateSubscription)
	subscriptions.Post("/:id/approve", handlers.ApproveSubscription)
	subscriptions.Put("/:id", handlers.UpdateSubscription)
	subscriptions.Delete("/:id", handlers.DeleteSubscription)
	subscriptions.Post("/renew", handlers.RenewSubscription)

	// Package routes
	pkgs := api.Group("/packages", middleware.AuthRequired)
	pkgs.Get("/", handlers.GetPackages)
	pkgs.Post("/", handlers.CreatePackage)
	pkgs.Put("/:id", handlers.UpdatePackage)
	pkgs.Delete("/:id", handlers.DeletePackage)

	// POS Operations
	pos := api.Group("/pos", middleware.AuthRequired)
	// Categories
	pos.Get("/categories", handlers.GetPosCategories)
	pos.Get("/categories/:id", handlers.GetPosCategoryDetail)
	pos.Post("/categories", handlers.CreatePosCategory)
	pos.Put("/categories/:id", handlers.UpdatePosCategory)
	pos.Delete("/categories/:id", handlers.DeletePosCategory)
	// Products
	pos.Get("/products", handlers.GetPosProducts)
	pos.Get("/products/:id", handlers.GetPosProductDetail)
	pos.Post("/products", handlers.CreatePosProduct)
	pos.Put("/products/:id", handlers.UpdatePosProduct)
	pos.Delete("/products/:id", handlers.DeletePosProduct)
	// Orders
	pos.Get("/orders", handlers.GetPosOrders)
	pos.Get("/orders/:id", handlers.GetPosOrderDetail)
	pos.Post("/orders", handlers.CreatePosOrder)
	pos.Put("/orders/:id", handlers.UpdatePosOrder)

	pos.Get("/stats", handlers.GetPosDashboardStats)

	// Lookup routes
	lookups := api.Group("/lookups", middleware.AuthRequired)
	lookups.Get("/roles", handlers.GetRoleOptions)
	lookups.Get("/companies", handlers.GetCompanyOptions)
	lookups.Get("/pos-categories", handlers.GetPosCategoryOptions)

	// General Parameter routes
	genParams := api.Group("/general-parameters", middleware.AuthRequired)
	genParams.Get("/", handlers.GetGeneralParameters)
	genParams.Post("/", handlers.CreateGeneralParameter)
	genParams.Put("/:id", handlers.UpdateGeneralParameter)
	genParams.Delete("/:id", handlers.DeleteGeneralParameter)

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return utils.SuccessResponse(c, "API is online", nil)
	})
}
