
let setUpConnection = (phaserGame) => {
    let pc = new RTCPeerConnection({
        iceServer: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
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
        // this.shipMovement = movementFun;
        log('New DataChannel ' + dc.label)
        dc.onclose = () => console.log('dc has closed')
        dc.onopen = () => {
        
            console.log('dc has opened')
            this.shipMovement = movementFun;
        }
        dc.onmessage = e => {
            // log(`Message from DataChannel '${dc.label}' payload '${e.data}'`)
            current_tick = e.data
            let gameState = JSON.parse(e.data);
            
            // console.log(gameState['StateMatch']['Lobby'])
            // code for displaying players below:
            gameState["StateMatch"]["Lobby"].forEach((player, index) => {
                if (window.ID != index && player != null) {
                    if (playerList[index]) {
                        console.log(player['Position']['Center']['X']);
                        console.log(player['Position']['Center']['Y']);
                        playerList[index].x = player['Position']['Center']['X'];
                        playerList[index].y = player['Position']['Center']['Y'];
                    } else {
                        let enemyShip = phaserGame.physics.add.sprite(player['Position']['Center']['X'], player['Position']['Center']['Y'], 'sprites')
                        enemyShip.displayWidth = 35;
                        enemyShip.displayHeight = 35;
                        playerList[index] = enemyShip;
                    }
                }
            });


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
                    playerSocket.onmessage = (msg) => { // must be sent through player socket bc it HAS to be reliable
                        console.log(msg.data);
                        window.ID = parseInt(msg.data);
                    }
                    playerSocket.send(encodedAnswer);
                })
            })
        }

        playerSocket.onclose = (event) => {
            console.log("CLOSED SOCKET NOW!! WAAA kinda cringe lmao.");
        }
    }
}