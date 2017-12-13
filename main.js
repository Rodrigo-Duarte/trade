var BtcRead = require('./btc_read.js')
var dashboard = require('./ui.js')

var bla = new BtcRead()

bla.registerTickerListener(function(ina) {
	var spread = (1 - parseFloat(ina.buy)/parseFloat(ina.sell))*100;
	dashboard.setTicker(
		parseFloat(ina.buy), 
		parseFloat(ina.sell), 
		parseFloat(ina.last), 
		parseFloat(ina.vol), 
		spread)
})

bla.registerOrderbookListener(function(ina) {
	var margin = 0.3
	var barrierCount = 7

	var asksHorizon = ina.asks.filter(x => x[0] <= ina.asks[0][0] * (1 + margin))
	var bidsHorizon = ina.bids.filter(x => x[0] >= ina.bids[0][0] * (1 - margin))

	var lowerBarriers = bidsHorizon.sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])
	var upperBarriers = asksHorizon.sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])

	dashboard.setLowerBarriers({
		titles: lowerBarriers.map(x => "R$ " + x[0]),
		data: lowerBarriers.map(x => x[1].toFixed(4))
	})
	dashboard.setUpperBarriers({
		titles: upperBarriers.map(x => "R$ " + x[0]),
		data: upperBarriers.map(x => x[1].toFixed(4))
	})
})




// var secsInADay = 24 * 60 * 60
// bla.registerTradeListener(function(ina) {
// 	var dateCut = new Date().getTime()/1000.0 - secsInADay * 5 // 5 days history
// 	var bla2 = ina.filter(a => a.date >= dateCut)
// 					.map(a => [new Date(a.date * 1000), a.price])
// 					.reduce((prev, cur) => 
// 						{prev.x.push(cur[0]); prev.y.push(cur[1]); return prev;}, 
// 						{x:[], y:[]}
// 					)
// 	dashboard.setTrades(bla2)
// })