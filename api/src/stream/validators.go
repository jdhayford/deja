package stream

import (
	// "deja-api/src/common"

	"time"

	"github.com/gin-gonic/gin"
)

type resourceParams struct {
	URL       string    `json:"url" binding:"exists"`
	SessionID uint      `json:"sessionID" binding:"exists"`
	Origin    string    `json:"origin"`
	Referer   string    `json:"referer"`
	UserAgent   string    `json:"userAgent"`
	Timestamp time.Time `json:"timestamp"`
}

// SessionValidator to validate parameters and bind into a session data model
type SessionValidator struct {
	Code       string  `json:"code" binding:"exists"`
	InstanceID string  `json:"instanceID" binding:"exists"`
	URL        string  `json:"url" binding:"exists"`
	Session    Session `json:"-"`
}

// Bind allows us to populate the SessionValidator from context
func (sessionValidator *SessionValidator) Bind(c *gin.Context) error {
	err := c.BindJSON(sessionValidator)
	if err != nil {
		return err
	}

	sessionValidator.Session.Code = sessionValidator.Code
	sessionValidator.Session.InstanceID = sessionValidator.InstanceID
	sessionValidator.Session.URL = sessionValidator.URL
	sessionValidator.Session.DeletedAt = nil

	return nil
}

// PlaylistValidator to validate parameters and bind into playlist data model
type PlaylistValidator struct {
	resourceParams
	Content  string   `json:"content"`
	Playlist Playlist `json:"-"`
}

// Bind allows us to populate the PlaylistValidator from context
func (playlistValidator *PlaylistValidator) Bind(c *gin.Context) error {
	err := c.BindJSON(playlistValidator)
	if err != nil {
		return err
	}

	playlistValidator.Playlist.SessionID = playlistValidator.SessionID
	playlistValidator.Playlist.Origin = playlistValidator.Origin
	playlistValidator.Playlist.Referer = playlistValidator.Referer
	playlistValidator.Playlist.Content = playlistValidator.Content
	playlistValidator.Playlist.URL = playlistValidator.URL
	playlistValidator.Playlist.UserAgent = playlistValidator.UserAgent
	playlistValidator.Playlist.DeletedAt = nil

	return nil
}

// SegmentValidator to validate parameters and bind into a segment data model
type SegmentValidator struct {
	resourceParams
	Duration float64 `json:"duration"`
	Segment  Segment `json:"-"`
}

// Bind allows us to populate the SegmentValidator from context
func (segmentValidator *SegmentValidator) Bind(c *gin.Context) error {
	err := c.BindJSON(segmentValidator)
	if err != nil {
		return err
	}
	segmentValidator.Segment.SessionID = segmentValidator.SessionID
	segmentValidator.Segment.Origin = segmentValidator.Origin
	segmentValidator.Segment.Referer = segmentValidator.Referer
	segmentValidator.Segment.Timestamp = segmentValidator.Timestamp
	segmentValidator.Segment.URL = segmentValidator.URL
	segmentValidator.Segment.Duration = segmentValidator.Duration
	segmentValidator.Segment.DeletedAt = nil

	return nil
}

// ReplayValidator to validate parameters and bind into a Replay data model
type ReplayValidator struct {
	ID        uint   `json:"id" binding:"exists"`
	SessionID uint   `json:"sessionID"`
	URL       string `json:"url"`
	Saved     bool   `json:"saved" binding:"exists"`
	Replay    Replay `json:"-"`
}

// Bind allows us to populate the ReplayValidator from context
func (replayValidator *ReplayValidator) Bind(c *gin.Context) error {
	err := c.BindJSON(replayValidator)
	if err != nil {
		return err
	}
	replayValidator.Replay.ID = replayValidator.ID
	replayValidator.Replay.SessionID = replayValidator.SessionID
	replayValidator.Replay.URL = replayValidator.URL
	replayValidator.Replay.Saved = replayValidator.Saved

	return nil
}
