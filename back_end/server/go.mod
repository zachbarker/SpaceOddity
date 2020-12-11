module example.com/server

go 1.15

replace example.com/sessionserializer => ../sessionserializer

require (
	example.com/sessionserializer v0.0.0-00010101000000-000000000000
	github.com/Tskken/quadgo v0.0.0-20190928081400-f9a846e0857b
	github.com/gorilla/websocket v1.4.2
	github.com/pion/webrtc/v3 v3.0.0-beta.13
)
