package stream

import (
	"time"

	"deja-api/src/common"
)

// Model is a replacement for gorm.Model use that includes json tags for its fields
type Model struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
}

// Resource is a base model for resources acquired for a stream
type Resource struct {
	Origin    string    `gorm:"index" json:"origin"`
	URL       string    `json:"url"`
	Referer   string    `gorm:"index" json:"referer"`
	UserAgent string    `gorm:"index" json:"userAgent"`
	SessionID uint      `gorm:"index" json:"sessionID"`
	Timestamp time.Time `json:"timestamp"`
}

// Session model represents a proxy to a user session
type Session struct {
	Model
	InstanceID string `gorm:"index" json:"instanceID"`
	URL        string `json:"url"`
	Code       string `gorm:"index" json:"code"`
	Watching   bool   `json:"watching"`
}

// Playlist model represents an .m3u8 resource for stream
type Playlist struct {
	Model
	Resource
	Content       string  `json:"content"`
	IsMaster      bool    `json:"isMaster"`
	IsMedia       bool    `json:"isMedia"`
	SegmentCount  uint8   `json:"segementCount"`
	TotalDuration float64 `json:"totalDuration"`
}

// Segment model represents a .ts resource for a stream
type Segment struct {
	Model
	Resource
	ThumbnailURL string  `json:"thumbnailURL"`
	Duration     float64 `json:"duration"`
}

// ResourceFailure model represents an instance of a failed resource fetch
type ResourceFailure struct {
	Model
	Resource
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

// Replay model represents an instance of a generated replay
type Replay struct {
	Model
	SessionID uint    `gorm:"index" json:"sessionID"`
	URL       string  `gorm:"index" json:"url"`
	Saved     bool    `json:"saved"`
	Duration  float64 `json:"duration"`
}

// SaveOne is a common persistence function to create a record
func SaveOne(data interface{}) error {
	db := common.GetDB()
	err := db.Save(data).Error
	return err
}

// AutoMigrate migrates the schema of database if needed
func AutoMigrate() {
	db := common.GetDB()

	db.AutoMigrate(&Session{}, &Replay{}, &Playlist{}, &Segment{}, &ResourceFailure{})
}
