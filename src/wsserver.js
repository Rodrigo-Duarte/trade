var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510}),
    BtcRead = require('./client/mbtc/mercado_bitcoin_read.js'),
    logger = require('./log.js'),
    BarrierParser = require('./parser/barrierparser.js');

function treatMessage(msg, btc, ws) {
    switch(msg) {
        case 'registerOrderbookListener':
            registerOrderbookListener(btc, ws)
            break
        default:
            logger.info('Unexpected message received in ws: ' + msg)
    }
}

function registerOrderbookListener(btc, ws) {
    var barrierParser = new BarrierParser()
    btc.registerOrderbookListener(function(ina) {
        try {
            var payload = JSON.stringify({
                type: 'barriers', 
                data: JSON.stringify(barrierParser.parse(ina, 0.13, 3)),
                timestamp: new Date()
            })
            console.log(payload)
            ws.send(payload)
        } catch(err) {
            ws.close()
        }
    })
}

wss.on('connection', function (ws) {
    console.log('connected')
    var btc = new BtcRead("LTC")
    
    ws.on('message', function (message) {
        treatMessage(message, btc, ws)
    })
    ws.on('close', function(ws) {
        console.log('close')
    })
})

console.log("UP!")