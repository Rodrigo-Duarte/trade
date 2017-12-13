var BtcRead = require('./mercado_bitcoin_read.js')
var dashboard = require('./ui.js')
var logger = require('./log.js')

function barrierSum(allOrders, barriers) {
    var asksToConsume = allOrders.slice()
    var accumulatedQty = []
    for ( i = 0 ; i < barriers.length ; i++) {
        var ind = asksToConsume.findIndex(a => a[0] == barriers[i][0])
        var totalVolumeUpToBarrier = asksToConsume.slice(0, ind + 1).map(a => a[1]).reduce((a, b) => a + b, 0)
        logger.verbose(`Group ${i} (${barriers[i]}): ` + JSON.stringify(asksToConsume.slice(0, ind + 1)) + " = " + totalVolumeUpToBarrier)
        accumulatedQty.push([barriers[i][0], totalVolumeUpToBarrier])
        asksToConsume = asksToConsume.splice(ind+1)
    }
    return accumulatedQty
}

function createCoinDashboard(coin, anchor){
    var btc = new BtcRead(coin)

    var tickerUi = dashboard.addTicker(anchor, 0, coin)
    btc.registerTickerListener(function(ina) {
        var spread = (1 - parseFloat(ina.buy)/parseFloat(ina.sell))*100;
        dashboard.updateTicker(
            tickerUi,
            parseFloat(ina.buy), 
            parseFloat(ina.sell), 
            parseFloat(ina.last), 
            parseFloat(ina.vol), 
            spread)
    })

    var upperBarrierUi = dashboard.addUpperBarriers(anchor+1,1, coin)
    var lowerBarrierUi = dashboard.addLowerBarriers(anchor+1,0, coin)
    btc.registerOrderbookListener(function(ina) {
        var margin = 0.15
        var barrierCount = 7

        var asksHorizon = ina.asks.filter(x => x[0] <= ina.asks[0][0] * (1 + margin))
        var bidsHorizon = ina.bids.filter(x => x[0] >= ina.bids[0][0] * (1 - margin))

        var upperBarriers = asksHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => b[0]-a[0])
        var lowerBarriers = bidsHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])

        var accUpperBar = barrierSum(asksHorizon, upperBarriers.slice().reverse())
        var accLowerBar = barrierSum(bidsHorizon, lowerBarriers.slice().reverse()).reverse()
        
        dashboard.updateBarriers(upperBarrierUi,
        {
            titles: accUpperBar.map(x => "R$ " + x[0].toFixed(2)),
            data: accUpperBar.map(x => x[1].toFixed(3))
        })
        dashboard.updateBarriers(lowerBarrierUi,
        {
            titles: accLowerBar.map(x => "R$ " + x[0].toFixed(2)),
            data: accLowerBar.map(x => x[1].toFixed(3))
        })
    })

    // var graph = dashboard.addGraph(anchor+3,0, coin)
    // var secsInADay = 24 * 60 * 60
    // btc.registerTradeListener(function(ina) {
    //     var dateCut = new Date().getTime()/1000.0 - secsInADay * 5 // 5 days history
    //     var bla2 = ina.filter(a => a.date >= dateCut)
    //                  .map(a => [new Date(a.date * 1000), a.price])
    //                  .reduce((prev, cur) => 
    //                      {prev.x.push(cur[0]); prev.y.push(cur[1]); return prev;}, 
    //                      {x:[], y:[]}
    //                  )
    //     dashboard.updateGraph(graph, bla2)
    // })
}

createCoinDashboard('BTC', 0)
createCoinDashboard('LTC', 3)
createCoinDashboard('BCH', 6)