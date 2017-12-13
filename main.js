var BtcRead = require('./mercado_bitcoin_read.js')
var dashboard = require('./ui.js')

function createCoinDashboard(coin, anchor){
    var btc = new BtcRead(coin)

    var tickerUi = dashboard.createTicker(anchor, 0, coin)
    var upperBarrierUi = dashboard.createUpperBarriers(anchor+1,1, coin)
    var lowerBarrierUi = dashboard.createLowerBarriers(anchor+1,0, coin)

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

    btc.registerOrderbookListener(function(ina) {
        var margin = 0.3
        var barrierCount = 7

        var asksHorizon = ina.asks.filter(x => x[0] <= ina.asks[0][0] * (1 + margin))
        var bidsHorizon = ina.bids.filter(x => x[0] >= ina.bids[0][0] * (1 - margin))

        var lowerBarriers = bidsHorizon.sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])
        var upperBarriers = asksHorizon.sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])

        dashboard.updateLowerBarriers(lowerBarrierUi,
        {
            titles: lowerBarriers.map(x => "R$ " + x[0]),
            data: lowerBarriers.map(x => x[1].toFixed(4))
        })
        dashboard.updateUpperBarriers(upperBarrierUi,
        {
            titles: upperBarriers.map(x => "R$ " + x[0]),
            data: upperBarriers.map(x => x[1].toFixed(4))
        })
    })
}

createCoinDashboard('BTC', 0)
createCoinDashboard('LTC', 3)


// var secsInADay = 24 * 60 * 60
// bla.registerTradeListener(function(ina) {
//  var dateCut = new Date().getTime()/1000.0 - secsInADay * 5 // 5 days history
//  var bla2 = ina.filter(a => a.date >= dateCut)
//                  .map(a => [new Date(a.date * 1000), a.price])
//                  .reduce((prev, cur) => 
//                      {prev.x.push(cur[0]); prev.y.push(cur[1]); return prev;}, 
//                      {x:[], y:[]}
//                  )
//  dashboard.setTrades(bla2)
// })