FROM golang:1.12-alpine AS builder

RUN apk update
RUN apk add git ffmpeg
RUN go get github.com/githubnemo/CompileDaemon

# Copy Source Code
ADD . /code
WORKDIR /code
COPY go.mod go.sum ./

# Resolve Go dependencies
RUN go get .

CMD CompileDaemon -build="go build -o api ./src" -command="./api"
