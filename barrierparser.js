function BarrierParser() {
}

BarrierParser.prototype.parse = function(ina, margin=0.12, barrierCount=3) {
    var asksHorizon = ina.asks.filter(x => x[0] <= ina.asks[0][0] * (1 + margin))
    var bidsHorizon = ina.bids.filter(x => x[0] >= ina.bids[0][0] * (1 - margin))

    var upperBarriers = asksHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => b[0]-a[0])
    var lowerBarriers = bidsHorizon.slice().sort((a,b) => b[1]-a[1]).slice(0,barrierCount).sort((a,b) => a[0]-b[0])

    var accUpperBar = barrierSum(asksHorizon, upperBarriers.slice().reverse())
    var accLowerBar = barrierSum(bidsHorizon, lowerBarriers.slice().reverse()).reverse()
    return { "upperBarriers" : accUpperBar, "lowerBarriers": lowerBarriers }
}

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

module.exports = BarrierParser