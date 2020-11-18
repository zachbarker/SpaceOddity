package main

import (
	"bufio"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc"
	"io"
	"os"
	"strings"
	"time"
)

fmt.Printf("test")