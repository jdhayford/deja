package stream

import (
	"fmt"
	"net/http"
	"os"
)

// const userAgent string = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"

func createRequest(url string, headers map[string]string) (req *http.Request, err error) {
	req, err = http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Failed to form request: %v\n", err)
		return nil, err
	}

	for header, value := range headers {
		req.Header.Set(header, value)
	}
	return
}

func closeAndDeleteAll(files []*os.File) {
	for _, file := range files {
		if file != nil {
			file.Close()
			os.Remove(file.Name())
		}
	}
}

func closeAndDelete(file *os.File) {
	if file != nil {
		file.Close()
		os.Remove(file.Name())
	}
}
