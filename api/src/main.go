package main

import (
	common "deja-api/src/common"
	stream "deja-api/src/stream"
	"math/rand"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

var db *gorm.DB
var err error

func main() {
	rand.Seed(time.Now().UnixNano())
	common.Init()
	stream.AutoMigrate()

	r := gin.Default()
	r.Use(common.CORSMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "swell"})
	})
	r.GET("/sessions", stream.RetrieveSessionList)
	r.GET("/sessions/:code", stream.RetrieveSession)
	r.GET("/sessions/:code/playlists", stream.RetrievePlaylists)
	r.GET("/sessions/:code/segments", stream.RetrieveSegments)
	r.POST("/sessions/:code/replays", stream.CreateSessionReplay)
	r.GET("/sessions/:code/replays", stream.GetSessionReplays)
	r.GET("/sessions/:code/status", stream.GetSessionStatus)
	r.GET("/replays/:id", stream.RetrieveReplay)
	r.POST("/replays/:id", stream.UpdateReplay)
	r.POST("/sessions", stream.CreateSession)
	r.POST("/playlists", stream.CreatePlaylist)
	r.POST("/segments", stream.CreateSegment)
	r.Run()
}
