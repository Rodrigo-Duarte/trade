function BarrierParser() {
}

BarrierParser.prototype.parse = function(ina, margin=0.12, barrierCount=3) {
    var asksHorizon = ina.asks.filter(x => x[0] <= ina.asks[0][0] * (1 + margin))
    var bidsHorizon = ina.bids.filter(x => x[0] >= ina.bids[0][0] * (1 - margin))

    var upperBarriers = asksHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => b[0]-a[0])
    var lowerBarriers = bidsHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])

    var accUpperBar = barrierSum(asksHorizon, upperBarriers.slice().reverse())
    var accLowerBar = barrierSum(bidsHorizon, lowerBarriers.slice().reverse()).reverse()
    return { "upperBarriers" : accUpperBar, "lowerBarriers": accLowerBar }
}

function barrierSum(allOrders, barriers) {
    var ordersToConsume = allOrders.slice()
    var accumulatedQty = []
    for ( i = 0 ; i < barriers.length ; i++) {
        var ind = ordersToConsume.findIndex(a => a[0] == barriers[i][0])
        var totalVolumeUpToBarrier = ordersToConsume.slice(0, ind + 1).map(a => a[1]).reduce((a, b) => a + b, 0)
        logger.debug(`Group ${i} (${barriers[i]}): ` + JSON.stringify(ordersToConsume.slice(0, ind + 1)) + " = " + totalVolumeUpToBarrier)
        accumulatedQty.push([barriers[i][0].toFixed(2), totalVolumeUpToBarrier.toFixed(3)])
        ordersToConsume = ordersToConsume.splice(ind+1)
    }
    return accumulatedQty
}

module.exports = BarrierParser