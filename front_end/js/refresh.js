let pc = new RTCPeerConnection({
    iceServer: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
});

let log = msg => {
    console.log(msg);
}

pc.onsignalingstatechange = e => log(pc.signalingState);
pc.oniceconnectionstatechange = e => log(pc.iceConnectionState);
pc.onicecandidate = event => {
    if (event.candidate === null)
        console.log(btoa(JSON.stringify(pc.localDescription)))
};

pc.ondatachannel = e => {
    let dc = e.channel;
    window.dc = dc;
  
    log('New DataChannel ' + dc.label)
    dc.onclose = () => console.log('dc has closed')
    dc.onopen = () => console.log('dc has opened')
    dc.onmessage = e => {
        log(`Message from DataChannel '${dc.label}' payload '${e.data}'`)
        current_tick = e.data
    }
    
}

let playerSocket = new WebSocket('ws://localhost:8080/websocket')

playerSocket.onopen = (event) => {
    playerSocket.onmessage = (msg) => {
        console.log("whole payload: ", msg)
        console.log("offer: ", msg['data']);
        let offer = JSON.parse(atob(msg['data']))
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        pc.createAnswer().then(d => {
            pc.setLocalDescription(d).then(() => {
                let encodedAnswer = btoa(JSON.stringify(pc.localDescription));
                console.log("about to send our answer");
                playerSocket.send(encodedAnswer);
            })
        })
    }

    playerSocket.onclose = (event) => {
        console.log("CLOSED SOCKET NOW!! WAAA kinda cringe lmao.");
    }
}