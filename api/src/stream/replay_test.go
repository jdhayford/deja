package stream

import (
	"fmt"
	"io/ioutil"
	"reflect"
	"regexp"
	"testing"
)

func testPlaylistWithName(playlistName string) string {
	path := fmt.Sprintf("testdata/%v.m3u", playlistName)
	data, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return string(data)
}

// TestCreateReplayPlaylist tests that a playlist is created from overlapping playlists
// that also respects the supplied duration
func TestCreateReplayPlaylist(t *testing.T) {
	playlist1 := Playlist{Content: testPlaylistWithName("playlist")}
	playlist2 := Playlist{Content: testPlaylistWithName("playlist2")}
	minDuration := float64(20)
	expectedURIs := []string{"/2.ts", "/3.ts", "/4.ts", "/5.ts", "/6.ts"}

	replayPlaylist := createReplayPlaylist([]Playlist{playlist1, playlist2}, minDuration)
	uriRegEx := regexp.MustCompile(`\/.*\.ts`)
	actualURIs := uriRegEx.FindAllString(replayPlaylist.String(), -1)

	if !reflect.DeepEqual(actualURIs, expectedURIs) {
		t.Errorf("createReplayPlaylist uses incorrect segments, got: %v, want: %v", actualURIs, expectedURIs)
	}

	if !replayPlaylist.Closed {
		t.Errorf("createReplayPlaylist failed to close playlist, got: %v, want: %v", replayPlaylist.Closed, true)
	}
}
