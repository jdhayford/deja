package common

import (
	"fmt"
	"os"

	gorm "github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // Needed for Postgres connection
)

var (
	host     = os.Getenv("POSTGRES_HOST")
	port     = 5432
	user     = os.Getenv("POSTGRES_USER")
	password = os.Getenv("POSTGRES_PASSWORD")
	dbname   = os.Getenv("POSTGRES_DB")
	dbURL    = os.Getenv("DATABASE_URL")
)

// DB is a scoped variable used to access DB connections
var DB *gorm.DB

// Init is a common utility function for creating DB connections
func Init() *gorm.DB {
	psqlConnectionString := dbURL
	if psqlConnectionString == "" {
		psqlTemplate := "host=%s port=%d user=%s password=%s dbname=%s sslmode=disable"
		psqlConnectionString = fmt.Sprintf(psqlTemplate, host, port, user, password, dbname)
	}

	var db, err = gorm.Open("postgres", psqlConnectionString)
	if err != nil {
		panic(err)
	}
	db.DB().SetMaxIdleConns(10)

	DB = db
	return DB
}

// Get is a common function to get a DB connection
func GetDB() *gorm.DB {
	return DB
}
