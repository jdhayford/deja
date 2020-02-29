package stream

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// Flags for FFMPEG use
var (
	debugLog          = []string{"-loglevel", "debug"}
	allowedExtension  = []string{"-allowed_extensions", "ALL"}
	protocolWhitelist = []string{"-protocol_whitelist", "file,http,https,tcp,tls,crypto"}
)

// ExtractThumbnail uses comand line arguments to use ffmpeg extract a frame from the given video file
func ExtractThumbnail(f *os.File) (*os.File, error) {
	filePath, err := filepath.Abs(f.Name())
	if err != nil {
		fmt.Printf("Error: filepath.Abs() failed with %s\n", err)
		return nil, err
	}

	thumbPath := fmt.Sprintf("/tmp/thumbnail.%v.jpg", int32(time.Now().Unix()))
	args := []string{"-n", "8", "ffmpeg", "-vframes", "1", "-i", filePath, "-y", thumbPath}
	cmd := exec.Command("nice", args...)
	if err = cmd.Run(); err != nil {
		fmt.Printf("Error: cmd.Run() failed with %s\n", err)
		return nil, err
	}

	return os.Open(thumbPath)
}

// CreateReplay uses comand line arguments to use ffmpeg to combine the given video files
func CreateReplay(file *os.File) (*os.File, error) {
	filePath, err := filepath.Abs(file.Name())
	if err != nil {
		fmt.Printf("Error: filepath.Abs() failed with %s\n", err)
		return nil, err
	}

	replayPath := fmt.Sprintf("/tmp/replay.%v.mp4", int32(time.Now().Unix()))

	args := []string{"-y"}
	inputArgs := []string{"-i", filePath, "-c", "copy", replayPath}
	args = append(args, debugLog...)
	args = append(args, allowedExtension...)
	args = append(args, protocolWhitelist...)
	args = append(args, inputArgs...)

	cmd := exec.Command("ffmpeg", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Error: cmd.Run() failed with %s: %s\n", err, string(output))
		return nil, err
	}

	return os.Open(replayPath)
}

func getFilePaths(files []*os.File) (filePaths []string, err error) {
	filePaths = make([]string, len(files))
	for i, f := range files {
		filePaths[i], err = filepath.Abs(f.Name())
		if err != nil {
			fmt.Printf("Error: filepath.Abs() failed with %s\n", err)
			return nil, err
		}
	}
	return
}
