module example.com/server

go 1.15

replace example.com/sessionserializer => ../sessionserializer

require (
	example.com/sessionserializer v0.0.0-00010101000000-000000000000
	github.com/gorilla/websocket v1.4.2
	github.com/pions/webrtc v1.2.0
)
