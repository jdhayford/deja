package stream

import (
	common "deja-api/src/common"
	"fmt"
	"io/ioutil"
	"net/http"
	"sort"
)

// CreateResourceFailure takes care of creating a record of a resource failure with the response
func CreateResourceFailure(resource Resource, resp *http.Response) {
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("failed to read response body: %v\n", err)
	}

	resourceFailure := ResourceFailure{Resource: resource, StatusCode: resp.StatusCode, Body: string(body)}
	if err := SaveOne(&resourceFailure); err != nil {
		fmt.Printf("failed to save resouce failure: %v\n", err)
	}
}

// GetResourceFailuresForSession returns all failures saved for a given session
func GetResourceFailuresForSession(session Session) ([]ResourceFailure, error) {
	var (
		failures []ResourceFailure
		err      error
	)

	db := common.GetDB()
	err = db.Model(&session).Order("created_at desc").Related(&failures).Error
	return failures, err
}

// FindSessionForCode returns a session record with the matching code
func FindSessionForCode(condition interface{}) (session Session, err error) {
	db := common.GetDB()
	err = db.Where(condition).Find(&session).Error
	return
}

// FindSessionForSegment returns a session record for the matching segment
func FindSessionForSegment(segment Segment) (session Session, err error) {
	db := common.GetDB()
	err = db.Model(&segment).Related(&session).Error
	return
}

// GetPlaylistsForSession takes Session reference and retrieves playlists for it
func GetPlaylistsForSession(session Session) (playlists []Playlist, err error) {
	db := common.GetDB()
	err = db.Order("created_at desc").Where("is_media = ?", true).Limit(50).Model(&session).Related(&playlists).Error
	return
}

// GetSessionList returns a list of sessions
func GetSessionList() (sessions []Session, err error) {
	db := common.GetDB()
	err = db.Model(&sessions).Find(&sessions).Error
	return
}

// GetSegmentsForSession takes Session reference and retrieves segments for it
func GetSegmentsForSession(session Session) (segments []Segment, err error) {
	db := common.GetDB()
	err = db.Model(&session).Related(&segments).Error
	return
}

// GetReplaysForSession takes Session reference and retrieves replays for it
func GetReplaysForSession(session Session) (replays []Replay, err error) {
	db := common.GetDB()
	err = db.Order("created_at desc").Model(&session).Related(&replays).Error
	return
}

// GetSession retrieves a session record from the db
func GetSession(sessionID uint) (Session, error) {
	var session Session
	db := common.GetDB()
	err := db.First(&session, sessionID).Error
	return session, err
}

// GetReplay retrieves a replay record from the db
func GetReplay(replayID uint) (replay Replay, err error) {
	db := common.GetDB()
	err = db.First(&replay, replayID).Error
	return
}

// GetSegmentsForSessionInRange takes Session reference and retrieves segments in the supplied range
// func GetSegmentsForSessionInRange(session Session, start time.Time, end time.Time) (segments []Segment, err error) {
func GetSegmentsForSessionInRange(session Session) (segments []Segment, err error) {
	db := common.GetDB()
	err = db.Order("timestamp desc").Limit(10).Model(&session).Related(&segments).Error
	sort.Slice(segments, func(i, j int) bool {
		return segments[i].Timestamp.Before(segments[j].Timestamp)
	})
	return
}
