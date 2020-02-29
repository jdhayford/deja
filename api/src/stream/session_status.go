package stream

import (
	"time"
)

// SessionStatus represents the health of a session by the last successful and failed playlists
type SessionStatus struct {
	LastPlaylistAt *time.Time `json:"lastPlaylistAt"`
	LastFailureAt  *time.Time `json:"lastFailureAt"`
}

func retrieveSessionStatus(session Session) (SessionStatus, error) {
	var (
		resourceFailures []ResourceFailure
		playlists        []Playlist
		err              error
	)
	location, _ := time.LoadLocation("America/New_York")

	resourceFailures, err = GetResourceFailuresForSession(session)
	playlists, err = GetPlaylistsForSession(session)

	if err != nil {
		return SessionStatus{}, err
	}

	sessionStatus := SessionStatus{}
	if len(playlists) > 0 {
		ts := playlists[0].CreatedAt.In(location)
		sessionStatus.LastPlaylistAt = &ts
	}
	if len(resourceFailures) > 0 {
		ts := resourceFailures[0].CreatedAt.In(location)
		sessionStatus.LastFailureAt = &ts
	}

	return sessionStatus, err
}
