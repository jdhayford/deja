package stream

import (
	"errors"
	"io/ioutil"
	"testing"
)

func getTestPlaylist() string {
	data, err := ioutil.ReadFile("testdata/playlist.m3u")
	if err != nil {
		panic(err)
	}
	return string(data)
}

func TestParse(t *testing.T) {
	expectedSeqNo := uint64(100)
	playlist := Playlist{Content: getTestPlaylist()}
	mPlaylist, err := playlist.Parse()

	if err != nil {
		t.Errorf("Parse() failed: %v", err)
	}
	if mPlaylist.SeqNo != expectedSeqNo {
		t.Errorf("Parse() was incorrect, got: %v, want: %v", mPlaylist.SeqNo, expectedSeqNo)
	}
}

func TestParseError(t *testing.T) {
	playlist := Playlist{Content: "Invalid Playlist"}
	_, err := playlist.Parse()
	expectedErr := errors.New("failed to parse manifest: #EXT3MU absent")

	if err == expectedErr {
		t.Errorf("Parse failed to error: got %v, want: %v", err, expectedErr)
	}
}
