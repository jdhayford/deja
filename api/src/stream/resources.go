package stream

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"deja-api/src/common"
)

func fetchSegment(url string, referer string) (*os.File, error) {
	var file *os.File
	start := time.Now()
	headers := map[string]string{
		"Referer": referer,
	}
	req, err := createRequest(url, headers)
	if err != nil {
		return nil, err
	}

	client := &http.Client{Transport: common.DefaultTransport}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Failed to get segment: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		fmt.Printf("problem fetching resource: %v\n", req)
		return nil, errors.New(resp.Status)
	}

	file, err = ioutil.TempFile("/tmp", "segment.*.ts")
	if err != nil {
		fmt.Printf("Failed to create tmp segment file: %v\n", err)
		return nil, err
	}

	if _, err := io.Copy(file, resp.Body); err != nil {
		fmt.Printf("Failed to copy segment: %v\n", err)
		return nil, err
	}

	elapsed := time.Since(start)
	fmt.Printf("Fetched segment in %s\n", elapsed)
	return file, nil
}
