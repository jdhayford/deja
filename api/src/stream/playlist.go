package stream

import (
	"deja-api/src/common"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/jdhayford/m3u8"
)

// Parse takes the receiving playlist content and produces a struct
func (playlist *Playlist) Parse() (*m3u8.MediaPlaylist, error) {
	contentReader := strings.NewReader(playlist.Content)
	p, _, err := m3u8.DecodeFrom(contentReader, true)
	if err != nil {
		fmt.Printf("failed to parse manifest: %v\n", err)
		return nil, err
	}

	return p.(*m3u8.MediaPlaylist), nil
}

// Fetch fetches and populates content for the receiving playlist
func (playlist *Playlist) Fetch() (*http.Response, error) {
	var err error
	playlistURL := playlist.URL
	// playlistURL := getProcessedURL(playlist.URL)
	headers := map[string]string{
		"Referer":    playlist.Referer,
		"User-Agent": playlist.UserAgent,
	}
	req, err := createRequest(playlistURL, headers)
	if err != nil {
		return nil, err
	}

	client := &http.Client{Transport: common.DefaultTransport}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("failed to fetch playlist content: \n%v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		errString := fmt.Sprintf("problem fetching playlist\n request: %v\n response: %v", req, resp)
		return resp, errors.New(errString)
	}

	p, listType, err := m3u8.DecodeFrom(resp.Body, false)
	if err != nil {
		fmt.Printf("failed to parse manifest: %v\n", err)
		return nil, err
	}

	playlist.Content = p.String()
	playlist.IsMaster = listType == m3u8.MASTER
	playlist.IsMedia = listType == m3u8.MEDIA

	if playlist.IsMedia {
		var totalDuration float64
		var segCount uint8
		for _, seg := range p.(*m3u8.MediaPlaylist).Segments {
			if seg == nil {
				break
			}
			segCount++
			totalDuration += seg.Duration
		}

		playlist.TotalDuration = totalDuration
		playlist.SegmentCount = segCount
	}
	return nil, nil
}

// Do nothing for now
func getProcessedURL(rawURL string) string {
	url, _ := url.Parse(rawURL)
	return url.String()
}
