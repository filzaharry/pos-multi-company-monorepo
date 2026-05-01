package tests

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http/httptest"
	"pos-backend/internal/models"
	"pos-backend/internal/routes"
	"pos-backend/pkg/database"
	"pos-backend/pkg/utils"
	"strconv"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func setupApp() *fiber.App {
	godotenv.Load("../.env")
	database.Connect()
	
	app := fiber.New()
	routes.SetupRoutes(app)
	return app
}

func getSuperAdminToken() string {
	roleID := uint(1)
	token, _ := utils.GenerateJWT(1, "superadmin@example.com", nil, &roleID, "Super Admin", time.Hour)
	return token
}

func TestCompleteWorkflow(t *testing.T) {
	app := setupApp()
	token := getSuperAdminToken()
	
	businessEmail := "test_cafe_" + strconv.Itoa(int(time.Now().Unix())) + "@company.com"

	// 1. Submit Subscription
	t.Run("Submit Subscription", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		writer.WriteField("full_name", "Test Owner")
		writer.WriteField("business_email", businessEmail)
		writer.WriteField("phone_number", "08123456789")
		writer.WriteField("company_name", "Test Cafe")
		writer.WriteField("package_id", "1")
		writer.WriteField("payment_method", "1")
		
		part, _ := writer.CreateFormFile("payment_upload", "test.jpg")
		part.Write([]byte("dummy content"))
		
		writer.Close()

		req := httptest.NewRequest("POST", "/api/v1/auth/register", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		
		resp, _ := app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)
	})

	// Get the last subscription ID
	var sub models.CompanySubscription
	database.DB.Where("business_email = ?", businessEmail).First(&sub)
	subID := sub.ID

	// 2. Approve Subscription
	t.Run("Approve Subscription", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/api/v1/subscriptions/"+strconv.Itoa(int(subID))+"/approve", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		
		resp, _ := app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)
	})

	// 3. Verify DB Changes
	var company models.Company
	t.Run("Verify DB", func(t *testing.T) {
		err := database.DB.Where("email = ?", businessEmail).First(&company).Error
		assert.NoError(t, err)

		var user models.User
		err = database.DB.Where("email = ?", businessEmail).First(&user).Error
		assert.NoError(t, err)
		assert.Equal(t, company.ID, *user.CompanyID)
	})

	// 4. Login with new user
	var userToken string
	t.Run("Login Flow", func(t *testing.T) {
		// Request OTP
		loginBody, _ := json.Marshal(map[string]string{
			"email":    businessEmail,
			"password": "Password123",
		})
		req := httptest.NewRequest("POST", "/api/v1/auth/login/otp", bytes.NewBuffer(loginBody))
		req.Header.Set("Content-Type", "application/json")
		resp, _ := app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)

		// Get OTP from DB
		var otp models.OTP
		database.DB.Where("email = ?", businessEmail).Last(&otp)

		// Verify OTP
		verifyBody, _ := json.Marshal(map[string]string{
			"email": businessEmail,
			"otp":   otp.Code,
		})
		req = httptest.NewRequest("POST", "/api/v1/auth/login/verify", bytes.NewBuffer(verifyBody))
		req.Header.Set("Content-Type", "application/json")
		resp, _ = app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		data := result["data"].(map[string]interface{})
		userToken = data["access_token"].(string)
	})

	// 5. CRUD POS Category
	t.Run("POS Category CRUD", func(t *testing.T) {
		// Create
		catBody, _ := json.Marshal(map[string]interface{}{
			"name":        "Test Category",
			"description": "Test Desc",
			"sort_order":  1,
		})
		req := httptest.NewRequest("POST", "/api/v1/pos/categories", bytes.NewBuffer(catBody))
		req.Header.Set("Authorization", "Bearer "+userToken)
		req.Header.Set("Content-Type", "application/json")
		resp, _ := app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)
		
		// List
		req = httptest.NewRequest("GET", "/api/v1/pos/categories", nil)
		req.Header.Set("Authorization", "Bearer "+userToken)
		resp, _ = app.Test(req)
		assert.Equal(t, 200, resp.StatusCode)
	})
}
