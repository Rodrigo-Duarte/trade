var BtcRead = require('./client/mbtc/mercado_bitcoin_read.js')
var dashboard = require('./ui.js')
var logger = require('./log.js')
var Advisor = require('./advisor.js')
var BarrierParser = require('./parser/barrierparser.js')

function barrierSum(allOrders, barriers) {
    var asksToConsume = allOrders.slice()
    var accumulatedQty = []
    for ( i = 0 ; i < barriers.length ; i++) {
        var ind = asksToConsume.findIndex(a => a[0] == barriers[i][0])
        var totalVolumeUpToBarrier = asksToConsume.slice(0, ind + 1).map(a => a[1]).reduce((a, b) => a + b, 0)
        logger.debug(`Group ${i} (${barriers[i]}): ` + JSON.stringify(asksToConsume.slice(0, ind + 1)) + " = " + totalVolumeUpToBarrier)
        accumulatedQty.push([barriers[i][0], totalVolumeUpToBarrier])
        asksToConsume = asksToConsume.splice(ind+1)
    }
    return accumulatedQty
}

function createCoinDashboard(coin, anchor){
    var btc = new BtcRead(coin)
    var advisor = new Advisor(coin)
    var advisorUi = dashboard.addAdvisor(anchor+1,2, coin)

    var tickerUi = dashboard.addTicker(anchor, 0, coin)
    btc.registerTickerListener(function(ina) {
        var spread = (1 - parseFloat(ina.buy)/parseFloat(ina.sell))*100;
        dashboard.updateTicker(tickerUi,
            parseFloat(ina.buy), parseFloat(ina.sell), parseFloat(ina.last), parseFloat(ina.vol), spread)
        logger.verbose({coin: coin,ask: ina.sell, bid: ina.buy, vol: ina.vol})
    })

    var upperBarrierUi = dashboard.addUpperBarriers(anchor+1,1, coin)
    var lowerBarrierUi = dashboard.addLowerBarriers(anchor+1,0, coin)
    var parser = new BarrierParser()
    btc.registerOrderbookListener(function(ina) {
        var barriers = parser.parse(ina)
        
        dashboard.updateBarriers(upperBarrierUi,{
            titles: barriers.upperBarriers.map(x => "R$ " + x[0]),
            data: barriers.upperBarriers.map(x => x[1])
        })
        dashboard.updateBarriers(lowerBarrierUi,{
            titles: barriers.lowerBarriers.map(x => "R$ " + x[0]),
            data: barriers.lowerBarriers.map(x => x[1])
        })
    })
}

createCoinDashboard('BTC', 0)
createCoinDashboard('LTC', 3)
createCoinDashboard('BCH', 6)