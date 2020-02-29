package common

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var (
	bucketName = "deja-assets"
)

// PutS3Object takes a file and will put it to the designated key
func PutS3Object(file *os.File) (string, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-east-1")},
	))
	uploader := s3manager.NewUploader(sess)

	var contentType *string
	switch filepath.Ext(file.Name()) {
	case ".jpg":
		contentType = aws.String("image/jpeg")
	case ".mp4":
		contentType = aws.String("audio/mpeg")
	default:
		fmt.Printf("Unexpected file extension found for file: %v\n", filepath.Base(file.Name()))
	}

	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket:             aws.String(bucketName),
		Key:                aws.String(filepath.Base(file.Name())),
		ContentDisposition: aws.String("inline"),
		ContentType:        contentType,
		Body:               file,
	})
	if err != nil {
		fmt.Printf("Error failed to upload file: %v\n", err)
		return "", err
	}

	return result.Location, nil
}
