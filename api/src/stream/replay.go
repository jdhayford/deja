package stream

import (
	"deja-api/src/common"
	"fmt"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/jdhayford/m3u8"
)

// A m3u8.MediaSegment indexed in the scope of a playlist collection
type indexedMediaSegment struct {
	MediaSegment  *m3u8.MediaSegment
	PlaylistIndex int
	SegmentIndex  int
}

// GenerateReplay takes a playlist, requests its segments, combines them and places them into S3
func GenerateReplay(playlists []Playlist, minDuration float64) (string, error) {
	var err error
	start := time.Now()

	if len(playlists) < 1 {
		err = fmt.Errorf("no playlists provided")
		fmt.Printf("failed to create replay playlist: %v\n", err)
		return "", err
	}
	playlistReferer := playlists[0].Referer

	playlistFile, err := ioutil.TempFile("/tmp", "playlist.*.m3u")
	if err != nil {
		fmt.Printf("Failed to create tmp playlist file: %v\n", err)
		return "", err
	}
	defer closeAndDelete(playlistFile)

	replayPlaylist := createReplayPlaylist(playlists, minDuration)
	localSegFiles, err := localizePlaylist(&replayPlaylist, playlistReferer)
	if err != nil {
		fmt.Printf("Failed failed to localize playlist segments: %v\n", err)
		return "", err
	}
	defer closeAndDeleteAll(localSegFiles)
	playlistFile.Write(replayPlaylist.Encode().Bytes())

	replayFile, err := CreateReplay(playlistFile)
	if err != nil {
		fmt.Printf("failed to create replay: %v\n", err)
		return "", err
	}
	defer closeAndDelete(replayFile)

	replayURL, err := common.PutS3Object(replayFile)
	if err != nil {
		fmt.Printf("failed to put to S3: %v\n", err)
		return "", err
	}

	elapsed := time.Since(start)
	fmt.Printf("Generated replay file from %v segments in %s: %v\n", replayPlaylist.Count(), elapsed, replayURL)
	return replayURL, nil
}

// localizePlaylist fetches each segment resource in a playlist and replaces the network location with the local
func localizePlaylist(mPlaylist *m3u8.MediaPlaylist, referer string) ([]*os.File, error) {
	var localSegFiles []*os.File

	// Download segments into local tmp files
	for _, mSegment := range mPlaylist.Segments {
		if mSegment == nil {
			continue
		}

		tmpFile, err := fetchSegment(mSegment.URI, referer)
		if err != nil {
			fmt.Printf("failed to fetch segment while localizing: %v\n", err)
			return nil, err
		}
		tmpPath, _ := filepath.Abs(tmpFile.Name()) // Really don't think this will fail
		localSegFiles = append(localSegFiles, tmpFile)
		mSegment.URI = tmpPath
	}

	return localSegFiles, nil
}

// createReplayPlaylist generates a manifest to create a replay with a min duration
func createReplayPlaylist(playlists []Playlist, minDuration float64) m3u8.MediaPlaylist {

	mPlaylists := parsePlaylists(playlists)
	replayPlaylist := copyMediaPlaylist(mPlaylists[0])
	uniqSegments := getUniqueSegments(mPlaylists)

	playlistURL := getPlaylistURL(playlists[0])
	segments := resolveSegmentURIs(uniqSegments, playlistURL)

	addSegmentsToPlaylist(&replayPlaylist, segments, minDuration)
	replayPlaylist.Close()
	return replayPlaylist
}

// Returns unique media segments from set of playlists in reverse chronological order
func resolveSegmentURIs(idxMediaSegments []indexedMediaSegment, baseURL url.URL) []indexedMediaSegment {
	for _, idxMediaSegment := range idxMediaSegments {
		mSegURL, err := url.Parse(idxMediaSegment.MediaSegment.URI)
		if err != nil {
			fmt.Printf("failed to parse media segment uri: %v", idxMediaSegment.MediaSegment.URI)
			panic(err)
		}

		if mSegURL.Host == "" {
			resolvedURL := baseURL.ResolveReference(mSegURL)
			idxMediaSegment.MediaSegment.URI = resolvedURL.String()
		}
	}

	return idxMediaSegments
}

// Returns unique media segments from set of playlists in reverse chronological order
func getUniqueSegments(mPlaylists []*m3u8.MediaPlaylist) []indexedMediaSegment {
	var uniqIdxSegments []indexedMediaSegment
	seenURIs := make(map[string]bool)
	sort.SliceStable(mPlaylists, func(i, j int) bool {
		return mPlaylists[i].SeqNo < mPlaylists[j].SeqNo
	})

	for i, mPlaylist := range mPlaylists {
		for j, mSegment := range mPlaylist.Segments {
			if mSegment == nil {
				break
			}
			if _, ok := seenURIs[mSegment.URI]; ok {
				continue
			}
			idxSegment := indexedMediaSegment{MediaSegment: mSegment, PlaylistIndex: i, SegmentIndex: j}
			uniqIdxSegments = append(uniqIdxSegments, idxSegment)
			seenURIs[mSegment.URI] = true
		}
	}

	return sortedSegments(uniqIdxSegments)
}

// This function expects to recieve media segments in reverse chronological order
func addSegmentsToPlaylist(mPlaylist *m3u8.MediaPlaylist, idxSegments []indexedMediaSegment, minDuration float64) {
	validSegments := make([]*m3u8.MediaSegment, 0)
	for _, idxSegment := range idxSegments {
		if minDuration <= 0 {
			break
		}
		validSegments = append(validSegments, idxSegment.MediaSegment)
		minDuration -= idxSegment.MediaSegment.Duration
	}

	for _, mSegment := range reverse(validSegments) {
		mPlaylist.AppendSegment(mSegment)
	}
}

func parsePlaylists(playlists []Playlist) []*m3u8.MediaPlaylist {
	var mPlaylists []*m3u8.MediaPlaylist
	for _, playlist := range playlists {
		mPlaylist, _ := playlist.Parse()
		mPlaylists = append(mPlaylists, mPlaylist)
	}
	return mPlaylists
}

func sortedSegments(idxSegments []indexedMediaSegment) []indexedMediaSegment {
	sort.SliceStable(idxSegments, func(i, j int) bool {
		if idxSegments[i].PlaylistIndex == idxSegments[j].PlaylistIndex {
			return idxSegments[i].SegmentIndex > idxSegments[j].SegmentIndex
		}
		return idxSegments[i].PlaylistIndex > idxSegments[j].PlaylistIndex
	})

	return idxSegments
}

func getPlaylistURL(playlist Playlist) url.URL {
	playlistURL, err := url.Parse(playlist.URL)
	if err != nil {
		fmt.Printf("failed to parse playlist url: %v", playlist.URL)
		panic(err)
	}
	return *playlistURL
}

func copyMediaPlaylist(mPlaylist *m3u8.MediaPlaylist) m3u8.MediaPlaylist {
	mPlaylistCopy := *mPlaylist
	// Does not remove segments, but rather used to reset internal references to FIFO segment slice
	for mPlaylistCopy.Remove() == nil {
		continue
	}
	// Now it is possible to replace the underlying Segment slice
	mPlaylistCopy.Segments = make([]*m3u8.MediaSegment, len(mPlaylistCopy.Segments))
	return mPlaylistCopy
}

func reverse(mSegments []*m3u8.MediaSegment) []*m3u8.MediaSegment {
	for i, j := 0, len(mSegments)-1; i < j; i, j = i+1, j-1 {
		mSegments[i], mSegments[j] = mSegments[j], mSegments[i]
	}
	return mSegments
}
