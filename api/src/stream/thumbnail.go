package stream

import (
	"deja-api/src/common"
	"fmt"
	"time"
)

func generateThumbnailForSegment(segment Segment) {
	session, err := FindSessionForSegment(segment)
	if err != nil {
		fmt.Printf("Failed to find session for segment: %v\n", err)
		return
	}

	if session.Watching {
		go generateThumbnail(&segment)
	}
}

// generateThumbnail takes a segment pointer, then fetches its resource url and generates a thumbnail
func generateThumbnail(segment *Segment) {
	start := time.Now()
	segFile, err := fetchSegment(segment.URL, segment.Referer)
	if err != nil {
		fmt.Printf("Failed to fetch segment: %v\n", err)
		return
	}
	defer closeAndDelete(segFile)

	thumbFile, err := ExtractThumbnail(segFile)
	if err != nil {
		fmt.Printf("Failed to extract thumbnail: %v\n", err)
		return
	}
	defer closeAndDelete(thumbFile)

	thumbnailURL, err := common.PutS3Object(thumbFile)
	if err != nil {
		fmt.Printf("Failed to put to S3: %v\n", err)
		return
	}
	common.GetDB().Model(&segment).Update("thumbnail_url", thumbnailURL)

	elapsed := time.Since(start)
	fmt.Printf("Generated thumbnail for segment in %s: %v\n", elapsed, thumbnailURL)
}
