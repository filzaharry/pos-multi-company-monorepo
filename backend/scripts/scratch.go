package main

import (
	"encoding/json"
	"fmt"
	"os"
	"pos-backend/pkg/database"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()
	repo := repository.NewUserRepository(database.DB)
	params := &utils.FilterParams{Limit: 2, Page: 1}
	users, _, err := repo.GetAll(params, nil, true)
	if err != nil {
		fmt.Println("GetAll Error:", err)
		os.Exit(1)
	}
	b, _ := json.Marshal(users)
	fmt.Println(string(b))
}
