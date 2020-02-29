package common

import (
	"crypto/tls"
	"net/http"
	"time"
)

// DefaultTransport is meant to be the http transport config used for all http requests
var DefaultTransport = &http.Transport{
	MaxIdleConns:    10,
	IdleConnTimeout: 30 * time.Second,
	TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
}
