package stream

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"deja-api/src/common"

	petname "github.com/dustinkirkland/golang-petname"
	"github.com/gin-gonic/gin"
)

// CreateSession will handle Gin request context to persiste a new Session record
func CreateSession(c *gin.Context) {
	sessionValidator := SessionValidator{}
	if err := sessionValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewValidatorError(err))
		return
	}

	sessionValidator.Session.Code = petname.Generate(2, "-")

	if err := SaveOne(&sessionValidator.Session); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewError("database", err))
		return
	}

	c.JSON(http.StatusCreated, sessionValidator.Session)
}

// RetrieveSessionList retrieves all sessions
func RetrieveSessionList(c *gin.Context) {
	sessions, err := GetSessionList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.NewError("sessions", errors.New("Problem fetching sessions")))
		return
	}

	c.JSON(http.StatusCreated, sessions)
}

// RetrieveSession takes a code parameter and returns a matching Session
func RetrieveSession(c *gin.Context) {
	code := c.Param("code")
	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}

	c.JSON(http.StatusOK, session)
}

// CreatePlaylist will persist a new Playlist record
func CreatePlaylist(c *gin.Context) {
	playlistValidator := PlaylistValidator{}
	if err := playlistValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewValidatorError(err))
		return
	}

	playlist := playlistValidator.Playlist
	resp, err := playlist.Fetch()
	if resp != nil {
		CreateResourceFailure(playlist.Resource, resp)
	}
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, common.NewError("playlist", err))
		return
	}

	if err := SaveOne(&playlist); err != nil {
		c.JSON(http.StatusInternalServerError, common.NewError("database", err))
		return
	}

	c.JSON(http.StatusCreated, playlist)
}

// CreateSegment will persist a new Segment record
func CreateSegment(c *gin.Context) {
	segmentValidator := SegmentValidator{}
	if err := segmentValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewValidatorError(err))
		return
	}

	segment := segmentValidator.Segment

	if err := SaveOne(&segment); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewError("database", err))
		return
	}

	c.JSON(http.StatusCreated, segment)
	generateThumbnailForSegment(segment)
}

// RetrievePlaylists fetches playlists for the given session code
func RetrievePlaylists(c *gin.Context) {
	code := c.Param("code")
	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}
	playlists, _ := GetPlaylistsForSession(session)
	c.JSON(http.StatusOK, playlists)
}

// GetSessionStatus fetches the status for the given session code
func GetSessionStatus(c *gin.Context) {
	code := c.Param("code")
	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}

	status, err := retrieveSessionStatus(session)
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Could not get session status")))
		return
	}
	c.JSON(http.StatusOK, status)
}

// RetrieveSegments fetches playlists for the given session token
func RetrieveSegments(c *gin.Context) {
	code := c.Param("code")
	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}
	segments, _ := GetSegmentsForSession(session)
	c.JSON(http.StatusOK, segments)
}

// CreateSessionReplay generates a replay from segments in supplied time range for a session
func CreateSessionReplay(c *gin.Context) {
	code := c.Param("code")
	seconds, err := strconv.ParseFloat(c.Query("seconds"), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.NewError("seconds", errors.New("seconds must be valid number")))
		return
	}

	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}

	playlists, err := GetPlaylistsForSession(session)
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("playlist", errors.New("Failed to get playlists")))
		return
	}

	replayURL, err := GenerateReplay(playlists, seconds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.NewError("replay", errors.New("Failed to create replay")))
		return
	}

	replay := Replay{SessionID: session.ID, URL: replayURL, Duration: seconds}
	if err := SaveOne(&replay); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewError("database", err))
		return
	}

	c.JSON(http.StatusOK, replay)
}

// GetSessionReplays gets all "saved" replays for a given session
func GetSessionReplays(c *gin.Context) {
	code := c.Param("code")
	session, err := FindSessionForCode(&Session{Code: code})
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("session", errors.New("Invalid session code")))
		return
	}
	replays, _ := GetReplaysForSession(session)

	c.JSON(http.StatusOK, replays)
}

// RetrieveReplay gets an existing Replay record for the supplied id
func RetrieveReplay(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.NewError("id", errors.New("id must be valid number")))
		return
	}

	replay, err := GetReplay(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("replay", errors.New("No replay found for id")))
		return
	}

	c.JSON(http.StatusOK, replay)
}

// UpdateReplay updates a Replay record
func UpdateReplay(c *gin.Context) {
	db := common.GetDB()

	replayValidator := ReplayValidator{}
	if err := replayValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewValidatorError(err))
		return
	}

	replay, err := GetReplay(replayValidator.ID)
	if err != nil {
		c.JSON(http.StatusNotFound, common.NewError("replay", errors.New("No replay found for id")))
		return
	}

	if err := db.Model(&replay).Update("saved", replayValidator.Saved).Error; err != nil {
		c.JSON(http.StatusUnprocessableEntity, common.NewError("database", err))
	}

	c.JSON(http.StatusOK, replay)
}
