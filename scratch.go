package main

import (
	"encoding/json"
	"fmt"
	"os"
	"pos-backend/internal/database"
	"pos-backend/internal/repository"
	"pos-backend/pkg/utils"
)

func main() {
	if err := database.Connect(); err != nil {
		fmt.Println("DB Connect Error:", err)
		os.Exit(1)
	}
	repo := repository.NewUserRepository(database.DB)
	params := &utils.FilterParams{Limit: 1, Page: 1}
	users, _, err := repo.GetAll(params, nil, true)
	if err != nil {
		fmt.Println("GetAll Error:", err)
		os.Exit(1)
	}
	b, _ := json.Marshal(users)
	fmt.Println(string(b))
}
