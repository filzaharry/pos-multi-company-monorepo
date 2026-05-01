package utils

import (
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendEmail(to string, subject string, body string) error {
	host := os.Getenv("MAIL_HOST")
	portStr := os.Getenv("MAIL_PORT")
	username := os.Getenv("MAIL_USERNAME")
	password := os.Getenv("MAIL_PASSWORD")
	fromAddress := os.Getenv("MAIL_FROM_ADDRESS")
	fromName := os.Getenv("MAIL_FROM_NAME")

	port, _ := strconv.Atoi(portStr)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(fromAddress, fromName))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(host, port, username, password)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
