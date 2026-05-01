package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	// 1. Connect to default 'postgres' database to check/create the target database
	dsnMaster := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable",
		dbHost, dbUser, dbPass, dbPort)

	db, err := sql.Open("pgx", dsnMaster)
	if err != nil {
		log.Fatalf("Failed to connect to master database: %v", err)
	}
	defer db.Close()

	// Check if database exists
	var exists bool
	query := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '%s')", dbName)
	err = db.QueryRow(query).Scan(&exists)
	if err != nil {
		log.Fatalf("Failed to check if database exists: %v", err)
	}

	if !exists {
		fmt.Printf("Database %s does not exist. Creating...\n", dbName)
		// Use fmt.Sprintf with quotes for dbName in case it has hyphens
		_, err = db.Exec(fmt.Sprintf("CREATE DATABASE \"%s\"", dbName))
		if err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
		fmt.Printf("Database %s created successfully.\n", dbName)
	}

	// 2. Connect to the actual target database using GORM
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		dbHost, dbUser, dbPass, dbName, dbPort)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to target database: ", err)
	}

	fmt.Printf("Connected to database: %s\n", dbName)
}
