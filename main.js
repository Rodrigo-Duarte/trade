var BtcRead = require('./btc_read.js')
var dashboard = require('./ui.js')

var bla = new BtcRead()

bla.registerTickerListener(function(ina) {
	// console.log(ina)
	dashboard.setTicker(parseFloat(ina.buy), parseFloat(ina.sell), parseFloat(ina.last), parseFloat(ina.vol))
})

bla.registerOrderbookListener(function(ina) {
	var ask = ina.asks.reduce((a,b,i) => a[0] > b[0] ? b : a, [Number.MAX_VALUE,-1])
	var bid = ina.bids.reduce((a,b,i) => a[0] < b[0] ? b : a, [Number.MIN_VALUE,-1])
	var spread = (1 - bid[0]/ask[0])*100;

	dashboard.setBuySellSpread(ask[0], bid[0], spread)
})
