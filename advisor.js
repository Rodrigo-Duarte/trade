function Advisor(coin) {
	this.coin = coin
	this.observedTickers = []
	this.observedBarriers = []
}

Advisor.prototype.ingestTicker = function(data) {
    this.observedTickers.push(data)
}

Advisor.prototype.ingestBarriers = function(lowerBars, upperBars) {
    this.observedBarriers.push({lowerBars: lowerBars, upperBars: upperBars})
}

Advisor.prototype.advise = function() {
    return ''+Math.random()
}

module.exports = Advisor